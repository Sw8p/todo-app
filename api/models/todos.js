const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  todo: {
    type: Boolean,
    required: true,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  urgency: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
    required: true
  },
  postit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Postit"
  }
});

module.exports = mongoose.model("Todo", todoSchema);
