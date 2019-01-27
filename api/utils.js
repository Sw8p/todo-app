const mongoose = require("mongoose");

const URL =
  process.env.URL + ":" + (process.env.PORT || 3000) || "http://localhost:3000";

const generatedMongoId = new mongoose.Types.ObjectId();

module.exports = {
  URL,
  generatedMongoId
};
