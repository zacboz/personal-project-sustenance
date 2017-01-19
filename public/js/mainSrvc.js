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
      return response;
    });
  };

  this.getUserCollections = function(userId){
    return $http({
      method: 'GET',
      url: '/sustenance/user-collections/'+userId
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

  this.updateCollection = function(Id, Name, Description, Imageurl, userId){
    var collection = {
      Name: Name,
      Description: Description,
      Imageurl: Imageurl,
      userId: userId
    }
    console.log(collection);
    return $http({
      method: 'PUT',
      url: '/sustenance/collections/update/'+Id,
      data: collection
    }).success(function(response){
      console.log('SERVICE', response);
      return response;
    });
  };

  this.deleteCollection = function(collection) {
    console.log('SERVICE', collection);
    var collectionId = collection.id;
    console.log(collectionId);
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


  var me = this;
  this.getUserProfile = function(callback){
    if(me.currentUser)
      callback(me.currentUser);
    return $http({
      method: 'GET',
      url: '/sustenance/user-profile/'
    }).then(function(response){
      me.currentUser = response.data;
      callback(me.currentUser);
    })
  }

  this.getLogout = function(){
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function(response){
      console.log('service firing', response);
    })
  };







});
