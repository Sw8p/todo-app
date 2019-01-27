const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

require("dotenv").config();

const todosRoutes = require("./routes/todos");
const postitsRoutes = require("./routes/postits");

/* Connect to the database Atlas MongoDB */
const ATLAS_USER = process.env.MONGO_ATLAS_USER;
const ATLAS_PWD = process.env.MONGO_ATLAS_PWD;
const ATLAS_DATABASE = process.env.MONGO_ATLAS_DB;

mongoose.connect(
  `mongodb+srv://${ATLAS_USER}:${ATLAS_PWD}@cluster0-hiilu.mongodb.net/${ATLAS_DATABASE}?retryWrites=true`,
  { useNewUrlParser: true, useCreateIndex: true }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // Middleware to Parse body
app.use(bodyParser.json());

/* Allow CORS header */
app.use((req, res, next) => {
  // Allow CORS -Cross-Origin Ressource Sharing
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //Option append first when POST or GET request
  if (req.methode === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next(); // block incomming request => on error handling
});

app.use("/todos", todosRoutes);
app.use("/postits", postitsRoutes);

app.use("/", (req, res, next) => {
  res.status(200).json({ message: "GET /" });
});

/* Handle Error */
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message
  });
});

module.exports = app;
