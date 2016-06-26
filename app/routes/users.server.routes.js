// Invocar el modo 'strict' de JavaScript
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

//Definir el método del módulo routes
module.exports = function(app) {
	//Configurar las rutas 'signup'
  app.route('/signup')
     .get(users.renderSignup)
     .post(users.signup);

  //Configurar las routes 'signin'
  app.route('/signin')
     .get(users.renderSignin)
     .post(passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/signin',
       failureFlash: true
     }));
     
 // Configurar las rutas Google OAuth 
  app.get('/oauth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    failureRedirect: '/signin'
  }));
  app.get('/oauth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin',
    successRedirect: '/'
  }));



    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/signin'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });







  //Configurar la route 'signout'
  app.get('/signout', users.signout);
};
