const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session")
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cors =require('cors');
const multer = require('multer');
var expressLayouts = require("express-ejs-layouts");
const isAuthenticated = require("./middleware/authen");
const Plant = require("./models/plant");
const Planter = require("./models/planter");
const sitemiddle = require("./middleware/sitemiddle");
const nodemailer = require('nodemailer');

let server = express();
server.use(express.json());
server.use(express.urlencoded());
server.set("view engine", "ejs");
server.use(express.static("public"));

server.use(expressLayouts);
server.set('view engine', 'ejs')
server.use(cookieParser());
server.use(flash());
server.use(sitemiddle);
server.use(session({ secret: "Its  a secret" }));
server.use(require("./middleware/sitemiddle"))

 server.use(cors({
   origin:["http://localhost:3000/"]

 }));


//  const upload = multer();

 
// server.post('/send-email', upload.none(), (req, res) => {
//   const { name, email, gender, message } = req.body;

//   const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'laibaayy0610@gmail.com', // Replace with your email address
//         pass: 'Lostyou456',
//       },
//   });

//   const mailOptions = {
//       from: email,
//       to: process.env.EMAIL_USER,
//       subject: `Contact Form Submission from ${name}`,
//       text: `Name: ${name}\nEmail: ${email}\nGender: ${gender}\nMessage: ${message}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           console.error('Error while sending email:', error);
//           return res.status(500).json({ success: false, error: error.message });
//       }
//       res.json({ success: true });
//   });
// });

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//       user: 'laibaayy0610@gmail.com',
//       pass: 'lostyou456', // Use the correct password or App Password here
//   },
// });

// // Test authentication
// transporter.verify(function(error, success) {
//   if (error) {
//       console.error('SMTP authentication failed:', error);
//   } else {
//       console.log('SMTP authentication successful');
//   }
// });


let plantApiRouter = require("./routes/api/plants");
const { clearCache } = require("ejs");
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
server.post("/contact", (req, res) => {
  const name = req.body.name;
  const gender = req.body.gender;
  const email = req.body.email;
  const message = req.body.message;
  console.log(name, email,gender, message);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hammadyousaf4001@gmail.com',
      pass: 'bgfk wnix vrjc nohh'
    }})
  var mailOptions = {
    from: email,
    to: 'hammadyousaf4001@gmail.com',
    subject: 'Sending Email using Node.js',
    cc: email,
    text: `Name: ${name}\nGender: ${gender}\nEmail: ${email}\nMessage: ${message}`
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
     
      console.log('Email sent: ' + info.response);
      res.render("contact", { successMessage: "Email sent successfully!" });
    }
  
})
});

server.get("/login", (req, res) => {
  res.render("login");
});
server.get("/register", (req, res) => {
  res.render("register");
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