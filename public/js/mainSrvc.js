angular.module('sustenance').service('mainSrvc', function($http){

  this.searchLocation = function(location){
    return $http({
      method: 'GET',
      url: '/sustenance/location/'+location
    }).then(function(response){
      console.log(response.data);
      return response.data;
    });
  };

  this.searchTerm = function(term, location){
    return $http({
      method: 'GET',
      url: '/sustenance/term/'+term+'/'+location
    }).then(function(response){
      console.log(response.data);
      return response.data;
    });
  };

  this.getPublicCollections = function(){
    return $http({
      method: 'GET',
      url: '/sustenance/public-collections'
    }).then(function(response){
      console.log(response);
      return response;
    });
  };

  this.getUserCollections = function(){
    return $http({
      method: 'GET',
      url: '/sustenance/user-collections/:userId'
    }).then(function(response){
      console.log(response);
      return response;
    });
  };

  this.createCollection = function(Name, Description, Imageurl, userId){
    var collection = {
      Name: Name,
      Description: Description,
      Imageurl: Imageurl,
      userId: userId
    }
    return $http({
      method: 'POST',
      url: '/sustenance/collections/create',
      data: collection
    }).success(function(response){
      console.log(response);
      return response;
    });
  };

  this.updateCollection = function(Name, Description, Imageurl, userId){
    var collection = {
      Name: Name,
      Description: Description,
      Imageurl: Imageurl,
      userId: userId
    }
    return $http({
      method: 'PUT',
      url: '/sustenance/collections/update',
      data: collection
    }).success(function(response){
      console.log(response);
      return response;
    });
  };

  this.deleteCollection = function(collection) {
    console.log(collection);
    var collectionId = collection.id;
    return $http({
      method: 'DELETE',
      url: '/sustenance/collections/'+collectionId
    }).then(function(response){
      console.log(response);
      return response;
    });
  };

  this.addRestaurant = function(restaurant, collectionId) {
    var payload = {
      restaurant: restaurant,
      collectionId: collectionId
    }
    console.log(payload);
    return $http({
      method: 'POST',
      url: '/sustenance/restaurants/add',
      data: payload
    }).success(function(response){
      console.log(response);
      return response;
    });
  }

  this.getRestaurantCollection = function(collectionId){
    console.log(collectionId);
    return $http({
      method: 'GET',
      url: '/sustenance/restaurants/'+collectionId
    }).then(function(response){
      console.log(response);
      return response;
    });
  };

  this.removeRestaurant = function(restaurant) {
    console.log(restaurant);
    // var Id = restaurant.id;
    var restaurantId = restaurant.id;
    console.log(restaurantId)
    return $http({
      method: 'DELETE',
      url: '/sustenance/restaurants/'+restaurantId
    }).then(function(response){
      console.log(response);
      return response;
    });
  };

  this.getAuth = function(){
    return $http({
      method: 'GET',
      url: 'api/checkauth/'
    }).then(function(response){
      console.log(response);
      return response;
    })
  }





});
