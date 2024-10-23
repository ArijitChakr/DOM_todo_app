const mongoose = require("mongoose");

const schema = mongoose.Schema;
const objectID = mongoose.Types.ObjectId;

const userSchema = new schema({
  email: { type: String, unique: true },
  password: String,
  fullName: String,
});

const todoSchema = new schema({
  title: String,
  description: String,
  dueDate: String,
  userId: objectID,
  isDone: Boolean,
});

const userModel = mongoose.model("users", userSchema);
const todoModel = mongoose.model("todos", todoSchema);

module.exports = {
  userModel,
  todoModel,
};
