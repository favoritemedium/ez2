
// Google auth

// - deps
var authom = require('authom');
var config = require('../config');

module.exports = function auth(app){

  authom.createServer({
    service: 'google'
  , id: config.google.id
  , secret: config.google.secret
  , scope: [
      'https://www.googleapis.com/auth/userinfo.profile'
    , 'https://www.googleapis.com/auth/userinfo.email'
    ]
  });

  // success
  authom.on('auth', function(req, res, auth){
  //console.log(auth);
    if (auth.data.hd === config.companyHost) {
      // Welcome
      req.session.authenticated = true;
      req.session.user = auth.data.name;
      req.session.email = auth.data.email;
      res.redirect('/instances');
    } else {
      // Go away!
      req.session.authenticated = false;
      req.session.authError = 'Please use your company account to login';
      res.redirect('/');
    }
  });

  // fail
  authom.on('error', function(req, res, err){
    // go back to home
    req.session.authError = 'Failed to authenticate';
    res.redirect('/')
  });

  var guard = function guard(req, res, next){
    if (!req.authenticated) {
      req.authenticated = false;
      res.locals({ authenticated: false });
      req.session = null;
      res.redirect('/');
    }
    next();
  };

  var middleware = function authMiddleware(req, res, next){
    var authError;
    var authenticated = req.session.authenticated === true;
    req.authenticated = authenticated;
    res.locals({ authenticated: authenticated });

    if (req.session.authError){
      authError = req.session.authError
      req.session.authError = null;
    }
    res.locals({
      authenticated: authenticated
    , authError: authError
    });
    next();
  };

  app.locals({ authenticated: false });

  return {
    app: authom.app
  , middleware: middleware
  , guard: guard
  }
};

// -
