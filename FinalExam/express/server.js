const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cors = require('cors');
const multer = require('multer');
const expressLayouts = require("express-ejs-layouts");
const isAuthenticated = require("./middleware/authenti");
const Plant = require("./models/plant");
const Planter = require("./models/planter");
const sitemiddle = require("./middleware/sitemiddle");
const nodemailer = require('nodemailer');
const isAdmin = require("./middleware/isAdmin");
const { uploadOnCloudinary } = require("./utils/cloudinaryConfig");
const { upload } = require("./middleware/multerConfig");
const path = require("path");
const fs = require("fs");
const ServiceWorkerRegistration = express();

let server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(express.static("public"));

server.use(expressLayouts);
server.use(cookieParser());
server.use(session({
  secret: "Its a secret",
  resave: false,
  saveUninitialized: true
}));
server.use(flash());

server.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user;
  next();
});

server.use(sitemiddle);
server.use(cors({ origin: ["http://localhost:3000/"] }));

let plantApiRouter = require("./routes/api/plants");
server.use("/", plantApiRouter);
server.use("/", require("./routes/api/planters"));
server.use("/", require("./routes/api/authen"));

// server.use((req,res,next) => {
//   console.log("Middleware");
//   next();
// });
server.get("/contact", (req, res) => {
  res.render("contact");
});

server.post("/contact",isAuthenticated,(req, res) => {
  const { name, gender, email, message } = req.body;
  console.log(name, email, gender, message);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hammadyousaf4001@gmail.com',
      pass: 'bgfk wnix vrjc nohh'
    }
  });

  var mailOptions = {
    from: email,
    to: 'hammadyousaf4001@gmail.com',
    subject: 'Sending Email using Node.js',
    cc: email,
    text: `Name: ${name}\nGender: ${gender}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.render("contact", { successMessage: "Email sent successfully!" });
    }
  });
});

server.get("/login", (req, res) => {
  res.render("login", { error: req.flash('error') });
});


server.get("/register", (req, res) => {
  res.render("register", { error: req.flash('error') });
});

server.get("/", (req, res) => {
  res.render("homepage", { user: req.session.user });
});

server.get("/homepage.html", (req, res) => {
  res.render("homepage", { user: req.session.user });
});
// server.get("/plants/:page?", async (req, res) => {
//   const page = req.params.page || 1; 
//   const skip = (page - 1) * pageSize;

//   const total = await Plant.countDocuments();
//   const totalPages = Math.ceil(total / pageSize);

//   const plants = await Plant.find()
//     .skip(skip)
//     .limit(pageSize);
//     console.log(plants);

//     res.render("list", {
//       pageTitle: "List All plants",
//       plants: plants,
//       total: total,
//       page: parseInt(page),
//       pageSize,
//       totalPages,
//       user: req.session.user.role,
//     });
// });
server.get("/plants/:page?", async (req, res) => {
  let page = Number(req.params.page) ? Number(req.params.page) : 1;
  let pageSize = 4;
  let plants = await Plant.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  let total = await Plant.countDocuments();
  console.log(req.session.user,'userr role')
  let totalPages = Math.ceil(total / pageSize);
  res.render("products", {
    pageTitle: "List All plants",
     plants:plants,
    total:total,
    page,
    pageSize,
    totalPages,
    user: req.session.user,
    searchTerm: "",
    searchHistory: req.session.searchHistory || [],
  });
});
server.get("/products", async (req, res) => {
  try {
    const products = await Plant.find();
    res.render("products", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});
mongoose.connect("mongodb+srv://laiba:laiba@cluster0.hstchks.mongodb.net/plants").then(() => {
  console.log("DB Connected");
});

server.listen(3000, () => {
  console.log("Server started at localhost:3000");
});



//cloudinary
ServiceWorkerRegistration.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const localFilePath = req.file.path;
  try {
    const imageUrl = await uploadOnCloudinary(localFilePath);
    if (imageUrl) {
      return res.redirect("/cars");
    } else {
      return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
});
