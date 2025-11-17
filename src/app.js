const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const appRouter = require("./route.js");
const StatusCodes = require("./utils/StatusCodes.js");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Welcome to the Spent API");
});

app.use("/api", appRouter)

app.use((_req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({
    message: "Route not found",
  });
});

module.exports = app;
