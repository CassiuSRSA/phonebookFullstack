const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

morgan.token("content", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

let persons = [];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name.trim() || !body.number.trim()) {
    return res.status(400).json({
      error: "Missing name or phone number",
    });
  }

  if (
    persons.find(
      (persons) => persons.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    console.log(people);
    const phoneBookSize = people.length;
    res.send(`<p>There are ${phoneBookSize} people in the phonebook</p>`);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((person) => {
    res.status(204).end();
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
