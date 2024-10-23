const { Router } = require("express");
const { userModel, todoModel } = require("../db");
const { authMiddleware } = require("../middleware");

const todoRouter = Router();

todoRouter.get("/user-details", authMiddleware, async function (req, res) {
  const userId = req.userId;

  const user = await userModel.findOne({
    _id: userId,
  });
  const todos = await todoModel.find({
    userId,
  });

  res.json({
    fullName: user.fullName,
    todos,
  });
});

todoRouter.post("/create-todo", authMiddleware, async function (req, res) {
  const userId = req.userId;
  const { title, description, dueDate, isDone } = req.body;

  const createdTodo = await todoModel.create({
    title,
    description,
    dueDate,
    isDone,
    userId,
  });

  res.json({
    title: createdTodo.title,
    description: createdTodo.description,
    dueDate: createdTodo.dueDate,
    isDone: createdTodo.isDone,
    id: createdTodo._id,
  });
});

todoRouter.put("/update-todo", authMiddleware, async function (req, res) {
  const userId = req.userId;

  const { title, description, dueDate, id, isDone } = req.body;

  await todoModel.updateOne(
    {
      _id: id,
      userId,
    },
    {
      title,
      description,
      dueDate,
      isDone,
    }
  );

  res.json({
    message: "todo updated successfully",
  });
});

todoRouter.delete("/delete-todo", authMiddleware, async function (req, res) {
  const userId = req.userId;

  const { id } = req.body;

  try {
    await todoModel.deleteOne({
      _id: id,
      userId,
    });

    res.json({
      message: "todo deleted",
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
});

module.exports = {
  todoRouter,
};
