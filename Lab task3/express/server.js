const express = require("express");
const mongoose = require("mongoose");
const Plant = require("./models/plant");
const Planter = require("./models/planter");
 const cors =require('cors');

let server = express();
server.use(express.json());
server.use(express.urlencoded());
server.set("view engine", "ejs");
server.use(express.static("public"));
var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);
server.set('view engine', 'ejs')
//server.use(require("./middlewares/siteMiddleware"))

 server.use(cors({
   origin:["http://localhost:3000/"]

 }));

let plantApiRouter = require("./routes/api/plants");
server.use("/", plantApiRouter);

server.use("/", require("./routes/api/planters"));

// server.use((req,res,next) => {
//   console.log("Middleware");
//   next();
// });

server.get("/contact", (req, res) => {
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
  const skip = (page - 1) * pageSize;

  const total = await Plant.countDocuments();
  const totalPages = Math.ceil(total / pageSize);

  const plants = await Plant.find()
    .skip(skip)
    .limit(pageSize);
    console.log(plants);

    res.render("list", {
      pageTitle: "List All plants",
      plants: plants,
      total: total,
      page: parseInt(page),
      pageSize,
      totalPages,
    });
});

mongoose.connect("mongodb+srv://laiba:laiba@cluster0.hstchks.mongodb.net/plants").then((data) => {
  console.log("DB Connected");
});

server.listen(3000, () => {
  console.log("Server started at localhost:3000");
});