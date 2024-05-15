const express = require("express");
const mongoose = require("mongoose");
const Plant = require("./models/plant");
const Planter = require("./models/planter");

let server = express();
server.use(express.json());
server.set("view engine", "ejs");
server.use(express.static("public"));
var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);
// server.use(require("./middlewares/siteMiddleware"))


let plantApiRouter = require("./routes/api/plants");
server.use("/", plantApiRouter);

server.use("/", require("./routes/api/planters"));

// server.use((req,res,next) => {
//   console.log("Middleware");
//   next();
// });

server.get("/contact.html", (req, res) => {
  res.render("contact");
});

server.get("/", (req, res) => {
  res.render("homepage");
});
server.get("/homepage.html", (req, res) => {
  res.render("homepage");
});


server.get("/plants/:page?", async (req, res) => {
    const page = req.params.page || 1; 
    const pageSize = 4;
    const skip = (page - 1) * pageSize;

    const total = await Plant.countDocuments();
    const totalPages = Math.ceil(total / pageSize);

    const plants = await Plant.find()
      .skip(skip)
      .limit(pageSize);

      res.render("list", {
        pageTitle: "List All plants",
        plants,
        total:total,
        page:parseInt(page),
        pageSize,
        totalPages,
      });
});


mongoose.connect("mongodb://localhost/plants").then((data) => {
  console.log("DB Connected");
});

server.listen(3000, () => {
  console.log("Server started at localhost:3000");
});