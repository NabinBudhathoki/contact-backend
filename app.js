const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
dotenv.config({ path: "./config.env" });

require("./db/conn");
// const User = require("./module/userSchema");



app.use(express.json());

//we link the router files to make our routr easy
app.use(require("./router/auth"));
app.use(require("./router/contacts"));

const PORT = process.env.PORT;


// app.get("/about", middleware, (req, res) => {
//   res.send("Hello  about world form the server");
// });

app.get("/contact", (req, res) => {
  res.send("Hello contact world form the server");
});

app.get("/signin", (req, res) => {
  res.send("Hello signin world form the server");
});

app.get("/signup", (req, res) => {
  res.send("Hello signup world form the server");
});

app.listen(PORT, () => {
  console.log(`server is running in port number ${PORT}`);
});
