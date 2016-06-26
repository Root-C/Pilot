module.exports = {
  db: 'mongodb://localhost/mean',
  sessionSecret: 'developmentSessionSecret',
  google: {
    clientID: '1095624437642-m42qgm8aikhhg2sa3a8duv2e1dqnvska.apps.googleusercontent.com',
    clientSecret: 'i_Kv3o9hbPm5Hjy4SuUJuGXT',
    callbackURL: 'http://localhost:3000/oauth/google/callback'
  },

  facebook : {
        clientID: '157347464681592', // your App ID
        clientSecret: '4e4fce1697b17da3483687633aff5e9e', // your App Secret
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
};
