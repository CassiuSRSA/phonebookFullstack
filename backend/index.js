const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
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

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get("/info", (req, res) => {
  const phoneBookSize = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${phoneBookSize} people</p>

  <p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const requestedId = +req.params.id;
  const person = persons.filter((person) => person.id === requestedId);

  if (person.length === 0) {
    return res.status(404).end();
  }

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const requestedId = +req.params.id;
  persons = persons.filter((person) => person.id !== requestedId);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
