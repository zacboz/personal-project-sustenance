var app = require('./index');
var http = require('http');
var config = require('./config.js');
var request = require('request')


module.exports = {


GetSearchLocation: function(req, res) {
  request({
  url: 'https://api.yelp.com/v3/businesses/search?term=restaurants&limit=8&location='+ req.params.location,
  method: 'GET',
  headers: {
    'Authorization': 'bearer' + ' ' + config.access_token
  }
}, function(error, response, body) {
  if(error) {
    console.log(error);
  } else {
    console.log(response.statusCode, body);
    res.status(200).json(response);
  }
});
},

GetSearchTerm: function(req, res) {
  request({
  url: 'https://api.yelp.com/v3/businesses/search?limit=8&location='+ req.params.location +'&term='+ req.params.term,
  method: 'GET',
  headers: {
    'Authorization': 'bearer' + ' ' + config.access_token
  }
}, function(error, response, body) {
  if(error) {
    console.log(error);
  } else {
    console.log(response.statusCode, body);
    res.status(200).json(response);
  }
});
},

// GetYelpAutoComplete: function(req, res) {
//   request({
//     url: 'https://api.yelp.com/v3/autocomplete?text=restaurants',
//     method: 'GET',
//     headers: {
//       'Authorization': 'bearer' + ' ' + config.access_token
//     }
//   }, function(error, response, body) {
//     if(error) {
//       console.log(error);
//     } else {
//       console.log(response.statusCode, body);
//     }
//   });
// },

GetYelpBusiness: function(req, res) {
  request({
    url: 'https://api.yelp.com/v3/businesses/black-sheep-cafe-provo',
    method: 'GET',
    headers: {
      'Authorization': 'bearer' + ' ' + config.access_token
    }
  }, function(error, response, body) {
    if(error) {
      console.log(error);
    } else {
      console.log(response.statusCode, body);
    }
  });
}


};
