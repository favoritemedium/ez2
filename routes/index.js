
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.session && req.session.authenticated) {
    return res.redirect('/instances');
  }
  res.render('index', { title: 'Express' });
};

exports.logout = function(req, res, next){
  req.session.authenticated = false;

  res.redirect('/');
};