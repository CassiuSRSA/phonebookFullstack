import React from "react";

const PersonList = ({ personsToShow, onDelete }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id, person.name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default PersonList;
