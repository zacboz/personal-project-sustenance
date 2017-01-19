var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var config = require('./config.js');
var session = require('express-session');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


var port = 3000;


var app = module.exports = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// console.log(__dirname);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: '1118546418257992',
    clientSecret: '30f7b590350d8b63eada838d0a06751b',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    var user = {
      profile: profile,
      token: accessToken
    }

    db.get_user_by_fbid([profile.id], function(err, user){
      if (err) {
        return done(err);
      }
      var fullname = profile.name.givenName + ' ' + profile.name.familyName
      // console.log('HERE IS THE USER', user);
      var name = fullname;
      var location = profile.locale;
      var email = profile.email;
      var id = profile.id;

      if (!user[0]) {
        db.add_user([id, name, email, location], function(err, user) {
          if (err) {
            console.log(err);
            return done(err);
          }
          done(null, user[0]);
        })
      } else {
        // console.log('FOUND USER');
        done(null, user[0]);
      }
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.facebookid);
});

passport.deserializeUser(function(id, done) {
    db.get_user_by_fbid([id], function(err, user){
      if(err) console.log('ERROR FINDING USER',err);
      done(null, user[0]);
    })
  });

var conn = massive.connectSync({
  connectionString : "postgres://postgres:@localhost/sustenance"
});
app.set('db', conn);
var db = app.get('db');
var collectionController = require('./collectionController');
var yelpController = require('./yelpController');

function isAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.status(403).send({message: 'Not authorized'})
  }
  return next();
}



app.get('/sustenance/public-collections', collectionController.getPublicCollections);
app.get('/sustenance/user-collections/:userId', isAuthenticated, collectionController.getUserCollections);
app.post('/sustenance/collections/create', isAuthenticated, collectionController.createCollection);
app.put('/sustenance/collections/update/:collectionId', isAuthenticated, collectionController.updateCollection);
app.delete('/sustenance/collections/:collectionId', collectionController.deleteCollection);
app.get('/sustenance/restaurants/:collectionId', collectionController.getRestaurantCollection);
app.post('/sustenance/restaurants/add', collectionController.addRestaurant);
app.delete('/sustenance/restaurants/:restaurantId', collectionController.removeRestaurant);
app.get('/sustenance/user-profile/', isAuthenticated, collectionController.getUserProfile);



app.get('/sustenance/location/:location', yelpController.GetSearchLocation);
app.get('/sustenance/term/:term/:location', yelpController.GetSearchTerm);
app.get('/sustenance/business', yelpController.GetYelpBusiness);
app.post('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/#/collections', failureRedirect: '/#/login' }));
app.get('/logout', function(req, res){
  req.logout();
  res.status(200).end();
});


app.listen(3000, function() {
  console.log('Connected on port', port)
});
