const mongoose = require("mongoose");
const { type } = require("os");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  remindAt: {
    type: Date,
    default: null,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completed: {
    type: Boolean,
    default: false,
  }
},
{ timestamps: true });

module.exports =
  mongoose.models.Todo || mongoose.model("Todo", todoSchema);