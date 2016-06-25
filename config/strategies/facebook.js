
"use strict";
// load all the things we need
var passport = require('passport'),
    LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller');


    module.exports = function() {
   passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : config.facebook.clientID,
        clientSecret    : config.facebook.clientSecret,
        callbackURL     : config.facebook.callbackURL,
        profileFields: ['emails','displayName']




    },

  function(req, accessToken, refreshToken, profile, done) {
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    var providerUserProfile = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      fullName: profile.displayName,
      email: profile.emails[0].value,
      username: profile.username,
      provider: 'facebook',
      providerId: profile.id,
      providerData: providerData
    };

    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};

