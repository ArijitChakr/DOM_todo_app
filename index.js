require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "TheIndianOcean";
const { userRouter } = require("./routes/users");
const { default: mongoose } = require("mongoose");
const { MONGO_URL } = require("./config");
const { todoRouter } = require("./routes/todos");

const app = express();

app.use("/", express.static(__dirname + "/frontend/signup"));
app.use("/signin", express.static(__dirname + "/frontend/signin"));
app.use("/me", express.static(__dirname + "/frontend/dashboard"));
app.use(express.json());

//frontend requests
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/frontend/signup/index.html`);
});
app.get("/signin", (req, res) => {
  res.sendFile(`${__dirname}/frontend/signin/index.html`);
});
app.get("/me", (req, res) => {
  res.sendFile(`${__dirname}/frontend/dashboard/index.html`);
});

//backend requests
app.use("/user", userRouter);
app.use("/todos", todoRouter);

async function main() {
  await mongoose.connect(MONGO_URL);
  app.listen(3000);
}

main();
