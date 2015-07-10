//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req,res,next){
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};
//get /login --Formulario de login
exports.new = function (req,res){
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new',{errors:errors});
};
//POST /login  --Crear la sesion

exports.create = function(req,res){
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password,function(error,user){
    if (error) {
      req.session.errors=[{"message": 'Se ha producido un error: ' + error }];
      res.redirect("/login");
      return;
    }
    //Crear req.session.user y guardar campos id y username
    //La sesión se define por la existencia de: req.session.user
    req.session.user ={id:user.id,username:user.username,iniSession: new Date().getTime()};
    console.log("*********User: " + JSON.stringify(req.session.user));
    res.redirect(req.session.redir.toString()); // redirección a path anterior a login
  });
};

//DELETE /logout --Destruir sesion
exports.destroy = function(req,res){
  delete req.session.user;
  res.redirect(req.session.redir.toString()); //redirect a path anterior a login
};
exports.autoLogout=function(req,res,next){
  console.log("***** Entro autoLogout");
  if (!req.session.user) {
    next(); //usuario no validado
  }else{
    //usuario validado
    if ((new Date().getTime()-req.session.user.iniSession)>120000) {
      delete req.session.user;
      res.redirect('/login');
    }else {
      next();
    }
  }
};
