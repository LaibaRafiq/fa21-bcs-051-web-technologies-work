const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.render('register', { user: req.session.user });
  }
  res.render('register', { error: req.flash('error') });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'User already registered with this email.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash('error', 'An error occurred while registering.');
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.render('login', { user: req.session.user });
  }
  res.render('login', { error: req.flash('error') });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'No account found with this email. Please register.');
      return res.redirect('/login');
    }

    if (await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.user = user;
      res.redirect('/');
    } else {
      req.flash('error', 'Invalid email or password.');
      res.redirect('/login');
    }
  } catch (error) {
    console.error("Error logging in:", error);
    req.flash('error', 'An error occurred while logging in.');
    res.redirect('/login');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
