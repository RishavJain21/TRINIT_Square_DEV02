//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
// const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
// mongoose.connect('mongodb://localhost:27017/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://user1:user1@cluster0.mcznv.mongodb.net/todolistDB"
);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
}); //process.env.PORT ||
