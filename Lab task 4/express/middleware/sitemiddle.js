module.exports = async function(req, res, next) {
    console.log("Session User in Middleware:", req.session ? req.session.user : 'No session');
    
    res.flash = function(type, message) {
      req.session.flash = { type, message };
    };
  
    if (req.session) {
      res.locals.flash = req.session.flash;
      req.session.flash = null;
      res.locals.user = req.session.user;
    } else {
      res.locals.flash = null;
      res.locals.user = null;
    }
  
    console.log("Locals User in Middleware:", res.locals.user);
    next();
  }

  