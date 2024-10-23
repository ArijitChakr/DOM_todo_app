const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userModel } = require("../db");
const { JWT_SECRET } = require("../config");
const userRouter = Router();

userRouter.post("/signup", async function (req, res) {
  const { email, password, fullName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    const response = await userModel.create({
      email,
      password: hashedPassword,
      fullName,
    });
    const token = jwt.sign(
      {
        id: response._id,
      },
      JWT_SECRET
    );
    res.json({
      token,
    });
  } catch (error) {
    res.json({
      message: "Email already in use",
    });
    return;
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const response = await userModel.findOne({
      email,
    });
    const isCorrect = bcrypt.compare(password, response.password);

    if (isCorrect) {
      const token = jwt.sign(
        {
          id: response._id,
        },
        JWT_SECRET
      );
      res.json({
        token,
      });
    } else {
      res.json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.json({
      message: "Invalid Username/Password",
    });
  }
});

module.exports = {
  userRouter,
};
