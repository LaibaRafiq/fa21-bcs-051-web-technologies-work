const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const User = require("../../models/user");

router.get('/register', (req, res) => {
  res.render('register');
});


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    const user = new User({ name, email, password: hashedPassword }); 
    
    await user.save();
   
    res.redirect('/login');
  } catch (error) {
    console.error("Error registering user:", error); 
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
  
    const user = await User.findOne({ email });
   
    if (user && await bcrypt.compare(password, user.password)) {
      
      req.session.userId = user._id;
     
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error("Error logging in:", error); 
    res.redirect('/login');
  }
});


router.get('/logout', (req, res) => {
 req.session.destroy();
  res.redirect('/');
});

module.exports = router;
