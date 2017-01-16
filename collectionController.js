var app = require('./index');
var db = app.get('db');

module.exports = {

getPublicCollections: function(req, res) {
  db.read_publicCollection(function(err, response) {
    res.status(200).json(response);
  });
},

getUserProfile: function(req, res) {
  // console.log('CURRENT USER', req.user);
  res.send(req.user);
},

getUserCollections: function(req, res) {
  // console.log('||||||||||||||||||',req.user);
  db.read_personalCollections([req.user.userid], function(err, response){
    // console.log('getting user collection', response);
    res.status(200).json(response);
  });
},

createCollection: function(req, res) {
  var collection = req.body;
  var values = [collection.Name, collection.Description, collection.Imageurl, collection.userId];
  console.log(collection.userId);
  db.create_collection(values, function(err, response) {
    console.log('creating collection')
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json(response);
    }
  });
},

updateCollection: function(req, res) {
  var collection = req.body;
  var collectionId = req.params.collectionId;
  console.log(collection);
  var values = [collectionId, collection.Name, collection.Description, collection.Imageurl, collection.userId];
  db.update_collection(values, function(err, response) {
    console.log('updating collection');
    if (err) {
      console.log(err);
      res.status(200).json(err);
    } else {
      console.log('updating', response);
      res.status(200).json(response);
    }
  });
},

deleteCollection: function(req, res) {
  var record = req.params;
  var recordId = record.collectionId;
  console.log('delete this', recordId);
  if (recordId) {
    db.delete_restaurantCollection([recordId], function(err, response){
      if (err){
        console.log(err);
      }
        console.log('deleting restaurant from restaurantCollection', response)
        db.delete_collection([recordId], function(err, response){
          console.log('deleting collection', response);
          res.status(200).json(response);
        })

    });
  }
},

getRestaurantCollection: function(req, res) {
  db.read_restaurantsInCollection(req.params.collectionId, function(err, response){
    res.status(200).json(response);
  });
},

addRestaurant: function(req, res) {
  var restaurant = req.body.restaurant;
  var values = [restaurant.image_url, restaurant.name, String(restaurant.rating), restaurant.categories, restaurant.price];
  db.add_restaurant(values, function(err, response) {
    if(err){
      console.log(err);
    }
    db.add_restaurantCollection([response[0].id, req.body.collectionId], function(err, response) {
      res.status(200).json(response);
    });
  });
},


removeRestaurant: function(req, res) {
  var record = req.params;
  console.log(req.params);
  var recordId = record.restaurantId;
  console.log('this:', recordId);
  if (recordId) {
    db.remove_restaurantCollection([recordId], function(err, response){
      if (err){
        console.log(err);
      }
        console.log('removing restaurant', response)
        db.remove_restaurant([recordId], function(err, response){
          console.log('removing restaurant from collection', response);
          res.status(200).json(response);
        })
    });
  }
},








};
