const jwt = require('jsonwebtoken');
const secret = 'your_secret_key';

module.exports = async function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.flash("danger", "Only logged in users are allowed to access!");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.session.user = decoded; 
    next();
  } catch (err) {
    req.flash("danger", "Invalid or expired token. Please log in again.");
    res.clearCookie('token');
    res.redirect("/login");
  }
};


