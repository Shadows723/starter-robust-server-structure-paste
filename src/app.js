const express = require("express");
const pastesRouter = require("./pastes/pastes.router");
const app = express();


app.use(express.json())
// TODO: Follow instructions in the checkpoint to implement ths API.
const pastes = require("./data/paste-data");

app.use("/pastes", pastesRouter);

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const {status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;
