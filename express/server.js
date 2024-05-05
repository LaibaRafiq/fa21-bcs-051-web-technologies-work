const express = require("express");
const mongoose = require("mongoose");
// const Mobile = require("./models/Mobile");
let server = express();
server.use(express.json());
server.set("view engine", "ejs");
server.use(express.static("public"));
var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);

let mobileApiRouter = require("./routes/api/mobiles");
server.use("/", mobileApiRouter);
server.use("/", require("./routes/api/games"));
server.use("/", require("./routes/site/games"));

server.get("/contact.html", (req, res) => {
  res.render("contact");
});
server.get("/", (req, res) => {
  res.render("homepage");
});

mongoose.connect("mongodb://localhost:27017").then((data) => {
  console.log("DB Connected");
});
server.listen(3000, () => {
  console.log("Server started at localhost:3000");
});