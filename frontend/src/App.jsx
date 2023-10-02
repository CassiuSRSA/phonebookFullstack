import { useState, useEffect } from "react";

import personsService from "./services/persons";

import Filter from "./components/Filter";
import Form from "./components/Form";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";

import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("Log from submit handler");

    const checkNumber = (number) => {
      return /^\d{2,3}-\d+$/.test(number);
    };
    console.log(newName.length);
    if (!newName.trim() || newName.length < 3 || !checkNumber(newNumber)) {
      setErrorMessage({
        message: `Name is too short or number is in wrong format`,
        errorType: "note error",
      });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }

    const clearInputs = () => {
      setNewName("");
      setNewNumber("");
    };

    const personsAlreadyExists = persons.find(
      (person) => person.name === newName
    );

    if (personsAlreadyExists) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const newObject = {
          ...personsAlreadyExists,
          number: newNumber,
        };
        personsService
          .update(personsAlreadyExists.id, newObject)
          .then((response) => {
            personsService
              .getAll()
              .then((updatedPersons) => setPersons(updatedPersons));
            clearInputs();
          });
        setErrorMessage({
          message: `Change number for '${newName}' to ${newNumber}`,
          errorType: "note success",
        });

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      } else {
        clearInputs();
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    setPersons(persons.concat(newPerson));

    personsService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      })
      .catch((error) => {
        setErrorMessage({
          message: `${error.response.data.error}`,
          errorType: "note error",
        });
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        console.log(error.response.data.error);
      });
    clearInputs();
    setErrorMessage({
      message: `${newName} was successfully added`,
      errorType: "note success",
    });
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const onDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.deletePerson(id).catch((error) => {
        setErrorMessage({
          message: `${name} has already been deleted`,
          errorType: "note error",
        });
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        return;
      });

      const newPersons = persons.filter((person) => person.id != id);
      setPersons(newPersons);
      setErrorMessage({
        message: `${name} has been deleted`,
        errorType: "note success",
      });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const nameChangeHandler = (e) => {
    setNewName(e.target.value);
  };
  const numberChangeHandler = (e) => {
    setNewNumber(e.target.value);
  };
  const filterChangeHandler = (e) => {
    setFilter(e.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter value={filter} onChange={filterChangeHandler} />
      <h2>Add new number</h2>
      <Form
        onSubmit={submitHandler}
        nameValue={newName}
        numberValue={newNumber}
        onNameChange={nameChangeHandler}
        onNumberChange={numberChangeHandler}
      />

      <h2>Numbers</h2>
      <PersonList personsToShow={personsToShow} onDelete={onDelete} />
    </div>
  );
};

export default App;
