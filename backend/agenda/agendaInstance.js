const Agenda = require("agenda");
require("dotenv").config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: "agendaJobs",
  }
});

module.exports = agenda;
