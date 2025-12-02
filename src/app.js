const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const appRouter = require("./route.js");
const StatusCodes = require("./utils/StatusCodes.js");
const cors = require("cors");

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://my-next-ebon-eta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Welcome to the Spent API");
});

app.use("/api", appRouter);

app.use((_req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({
    message: "Route not found",
  });
});

module.exports = app;
