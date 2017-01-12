'use strict';

angular.module('sustenance', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: '/',
        templateUrl: "/views/home.html",
        controller: 'homeCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: "/views/login.html",
        controller: 'loginCtrl'
    }).state('collections', {
        url: '/collections',
        templateUrl: '/views/collections.html',
        controller: 'collectionsCtrl'
    }).state('details', {
        url: '/details/:collectionId',
        templateUrl: '/views/details.html',
        controller: 'detailsCtrl'
    }).state('profile', {
        url: '/profile',
        templateUrl: '/views/profile.html',
        controller: 'profileCtrl'
    });

    $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('sustenance').service('mainSrvc', function ($http) {

  this.searchLocation = function (location) {
    return $http({
      method: 'GET',
      url: '/sustenance/location/' + location
    }).then(function (response) {
      console.log(response.data);
      return response.data;
    });
  };

  this.searchTerm = function (term, location) {
    return $http({
      method: 'GET',
      url: '/sustenance/term/' + term + '/' + location
    }).then(function (response) {
      console.log(response.data);
      return response.data;
    });
  };

  this.getPublicCollections = function () {
    return $http({
      method: 'GET',
      url: '/sustenance/public-collections'
    }).then(function (response) {
      console.log(response);
      return response;
    });
  };

  this.getUserCollections = function () {
    return $http({
      method: 'GET',
      url: '/sustenance/user-collections/:userId'
    }).then(function (response) {
      console.log(response);
      return response;
    });
  };

  this.createCollection = function (Name, Description, Imageurl, userId) {
    var collection = {
      Name: Name,
      Description: Description,
      Imageurl: Imageurl,
      userId: userId
    };
    return $http({
      method: 'POST',
      url: '/sustenance/collections/create',
      data: collection
    }).success(function (response) {
      console.log(response);
      return response;
    });
  };

  this.updateCollection = function (Name, Description, Imageurl, userId) {
    var collection = {
      Name: Name,
      Description: Description,
      Imageurl: Imageurl,
      userId: userId
    };
    return $http({
      method: 'PUT',
      url: '/sustenance/collections/update',
      data: collection
    }).success(function (response) {
      console.log(response);
      return response;
    });
  };

  this.deleteCollection = function (collection) {
    console.log(collection);
    var collectionId = collection.id;
    return $http({
      method: 'DELETE',
      url: '/sustenance/collections/' + collectionId
    }).then(function (response) {
      console.log(response);
      return response;
    });
  };

  this.addRestaurant = function (restaurant, collectionId) {
    var payload = {
      restaurant: restaurant,
      collectionId: collectionId
    };
    console.log(payload);
    return $http({
      method: 'POST',
      url: '/sustenance/restaurants/add',
      data: payload
    }).success(function (response) {
      console.log(response);
      return response;
    });
  };

  this.getRestaurantCollection = function (collectionId) {
    console.log(collectionId);
    return $http({
      method: 'GET',
      url: '/sustenance/restaurants/' + collectionId
    }).then(function (response) {
      console.log(response);
      return response;
    });
  };

  this.removeRestaurant = function (restaurant) {
    console.log(restaurant);
    // var Id = restaurant.id;
    var restaurantId = restaurant.id;
    console.log(restaurantId);
    return $http({
      method: 'DELETE',
      url: '/sustenance/restaurants/' + restaurantId
    }).then(function (response) {
      console.log(response);
      return response;
    });
  };
});
'use strict';

angular.module('sustenance').controller('collectionsCtrl', function ($scope, mainSrvc, $stateParams) {

  $scope.test = 'hello world';

  mainSrvc.getPublicCollections().then(function (response) {
    $scope.public_collections = response.data;
    console.log($scope.public_collections);
  });

  mainSrvc.getUserCollections().then(function (response) {
    $scope.user_collections = response.data;
    console.log($scope.user_collections);
  });

  $scope.createCollection = function (Name, Description, Imageurl, userId) {
    console.log(userId);
    mainSrvc.createCollection(Name, Description, Imageurl, userId);
    $scope.collection_name = '';
    $scope.collection_description = '';
    $scope.collection_imageurl = '';
    $scope.collection_userId = '';
  };

  $scope.deleteCollection = function (collection) {
    console.log(collection);
    mainSrvc.deleteCollection(collection).then(function () {
      mainSrvc.getPublicCollections().then(function (response) {
        $scope.public_collections = response.data;
      });
    });
  };
});
'use strict';

angular.module('sustenance').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams) {

  $scope.updateCollection = function (Name, Description, Imageurl, userId) {
    console.log(userId);
    mainSrvc.updateCollection(Name, Description, Imageurl, userId);
    $scope.collection_name = '';
    $scope.collection_description = '';
    $scope.collection_imageurl = '';
    $scope.collection_userId = '';
  };

  $scope.searchTerm = function (term, location) {
    console.log(location);
    console.log(term);
    mainSrvc.searchTerm(term, location).then(function (response) {
      $scope.restaurants = JSON.parse(response.body);
      console.log($scope.restaurants.businesses);
      return $scope.restaurants.businesses;
    });
  };

  mainSrvc.getRestaurantCollection($stateParams.collectionId).then(function (response) {
    $scope.restaurantCollection = response.data;
    console.log($scope.restaurantCollection);
  });

  $scope.addRestaurant = function (restaurant) {
    mainSrvc.addRestaurant(restaurant, $stateParams.collectionId).then(function (response) {
      console.log(response);
      $scope.add = response.body;
    });
  };

  $scope.removeRestaurant = function (restaurant) {
    console.log(restaurant);
    mainSrvc.removeRestaurant(restaurant).then(function () {
      mainSrvc.getRestaurantCollection($stateParams.collectionId).then(function (response) {
        $scope.restaurantCollection = response.data;
        console.log($scope.restaurantCollection);
      });
    });
  };
});
'use strict';

angular.module('sustenance').controller('homeCtrl', function ($scope, mainSrvc, $stateParams) {

  $scope.searchLocation = function (location) {
    console.log(location);
    mainSrvc.searchLocation(location).then(function (response) {
      $scope.restaurants = JSON.parse(response.body);
      console.log($scope.restaurants.businesses);
      return $scope.restaurants.businesses;
    });
  };

  mainSrvc.getPublicCollections().then(function (response) {
    $scope.collections = response.data;
    console.log($scope.collections);
  });
});
'use strict';

angular.module('sustenance').controller('loginCtrl', function ($scope, mainSrvc, $stateParams) {});
'use strict';

angular.module('sustenance').controller('profileCtrl', function ($scope, mainSrvc, $stateParams) {});