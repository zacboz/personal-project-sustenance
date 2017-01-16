'use strict';

// var login = {
//    security: (mainService, $state) => {
//      return mainService.getAuth()
//        .catch((err) => {
//          console.log(err);
//          if(err.status === 401){
//            $state.go("login");s
//          } else if (err.status === 403){
//            $state.go("home");
//          }
//        })
//    }
//  }

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
      return response;
    });
  };

  this.getUserCollections = function (userId) {
    return $http({
      method: 'GET',
      url: '/sustenance/user-collections/' + userId
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

  this.updateCollection = function (Id, Name, Description, Imageurl, userId) {
    var collection = {
      Name: Name,
      Description: Description,
      Imageurl: Imageurl,
      userId: userId
    };
    console.log(collection);
    return $http({
      method: 'PUT',
      url: '/sustenance/collections/update/' + Id,
      data: collection
    }).success(function (response) {
      console.log('SERVICE', response);
      return response;
    });
  };

  this.deleteCollection = function (collection) {
    console.log('SERVICE', collection);
    var collectionId = collection.id;
    console.log(collectionId);
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

  var me = this;
  this.getUserProfile = function (callback) {
    if (me.currentUser) callback(me.currentUser);
    return $http({
      method: 'GET',
      url: '/sustenance/user-profile/'
    }).then(function (response) {
      me.currentUser = response.data;
      callback(me.currentUser);
    });
  };
});
'use strict';

angular.module('sustenance').controller('collectionsCtrl', function ($scope, $rootScope, mainSrvc, $stateParams) {

  $scope.refresh = function () {

    mainSrvc.getPublicCollections().then(function (response) {
      $scope.public_collections = response.data;
      console.log($scope.public_collections);
    });

    $scope.createCollection = function (Name, Description, Imageurl) {
      mainSrvc.createCollection(Name, Description, Imageurl, $rootScope.currentUser.userid);
      $scope.collection_name = '';
      $scope.collection_description = '';
      $scope.collection_imageurl = '';
    };

    $scope.deleteCollection = function (collection) {
      console.log('CONTROL', collection);
      mainSrvc.deleteCollection(collection).then(function () {
        mainSrvc.getPublicCollections().then(function (response) {
          $scope.public_collections = response.data;
          console.log('public', response.data);
        });
        mainSrvc.getUserCollections($rootScope.currentUser.userid).then(function (response) {
          $scope.user_collections = response.data;
          console.log($scope.user_collections);
        });
      });
    };

    mainSrvc.getUserProfile(function (currentUser) {
      // console.log('FIRED', currentUser);
      $rootScope.currentUser = currentUser;
      mainSrvc.getUserCollections($rootScope.currentUser.userid).then(function (response) {
        $scope.user_collections = response.data;
        // console.log($scope.user_collections);
      });
    });
  };
  $scope.refresh();
});
'use strict';

angular.module('sustenance').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams, $rootScope) {

  $scope.updateCollection = function (Name, Description, Imageurl) {
    mainSrvc.updateCollection($stateParams.collectionId, Name, Description, Imageurl, $rootScope.currentUser.userid);
    $scope.collection_name = '';
    $scope.collection_description = '';
    $scope.collection_imageurl = '';
    console.log($rootScope.currentUser.userid);
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

  console.log($rootScope);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwiY29udHJvbGxlcnMvY29sbGVjdGlvbnNDdHJsLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsc0N0cmwuanMiLCJjb250cm9sbGVycy9ob21lQ3RybC5qcyIsImNvbnRyb2xsZXJzL2xvZ2luQ3RybC5qcyIsImNvbnRyb2xsZXJzL3Byb2ZpbGVDdHJsLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwic2VhcmNoTG9jYXRpb24iLCJsb2NhdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwic2VhcmNoVGVybSIsInRlcm0iLCJnZXRQdWJsaWNDb2xsZWN0aW9ucyIsImdldFVzZXJDb2xsZWN0aW9ucyIsInVzZXJJZCIsImNyZWF0ZUNvbGxlY3Rpb24iLCJOYW1lIiwiRGVzY3JpcHRpb24iLCJJbWFnZXVybCIsImNvbGxlY3Rpb24iLCJzdWNjZXNzIiwidXBkYXRlQ29sbGVjdGlvbiIsIklkIiwiZGVsZXRlQ29sbGVjdGlvbiIsImNvbGxlY3Rpb25JZCIsImlkIiwiYWRkUmVzdGF1cmFudCIsInJlc3RhdXJhbnQiLCJwYXlsb2FkIiwiZ2V0UmVzdGF1cmFudENvbGxlY3Rpb24iLCJyZW1vdmVSZXN0YXVyYW50IiwicmVzdGF1cmFudElkIiwibWUiLCJnZXRVc2VyUHJvZmlsZSIsImNhbGxiYWNrIiwiY3VycmVudFVzZXIiLCIkc2NvcGUiLCIkcm9vdFNjb3BlIiwibWFpblNydmMiLCIkc3RhdGVQYXJhbXMiLCJyZWZyZXNoIiwicHVibGljX2NvbGxlY3Rpb25zIiwidXNlcmlkIiwiY29sbGVjdGlvbl9uYW1lIiwiY29sbGVjdGlvbl9kZXNjcmlwdGlvbiIsImNvbGxlY3Rpb25faW1hZ2V1cmwiLCJ1c2VyX2NvbGxlY3Rpb25zIiwicmVzdGF1cmFudHMiLCJKU09OIiwicGFyc2UiLCJib2R5IiwiYnVzaW5lc3NlcyIsInJlc3RhdXJhbnRDb2xsZWN0aW9uIiwiYWRkIiwiY29sbGVjdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLFFBQVFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCLENBQUMsV0FBRCxDQUE3QixFQUNLQyxNQURMLENBQ1ksVUFBVUMsY0FBVixFQUEwQkMsa0JBQTFCLEVBQTZDOztBQUVqREQsbUJBQ0tFLEtBREwsQ0FDVyxNQURYLEVBQ2tCO0FBQ1ZDLGFBQUksR0FETTtBQUVWQyxxQkFBYSxrQkFGSDtBQUdWQyxvQkFBWTtBQUhGLEtBRGxCLEVBTUtILEtBTkwsQ0FNVyxPQU5YLEVBTW1CO0FBQ1hDLGFBQUksUUFETztBQUVYQyxxQkFBYSxtQkFGRjtBQUdYQyxvQkFBWTtBQUhELEtBTm5CLEVBV0tILEtBWEwsQ0FXVyxhQVhYLEVBV3lCO0FBQ2pCQyxhQUFJLGNBRGE7QUFFakJDLHFCQUFhLHlCQUZJO0FBR2pCQyxvQkFBWTtBQUhLLEtBWHpCLEVBZ0JLSCxLQWhCTCxDQWdCVyxTQWhCWCxFQWdCcUI7QUFDYkMsYUFBSSx3QkFEUztBQUViQyxxQkFBYSxxQkFGQTtBQUdiQyxvQkFBWTtBQUhDLEtBaEJyQixFQXFCS0gsS0FyQkwsQ0FxQlcsU0FyQlgsRUFxQnFCO0FBQ2JDLGFBQUksVUFEUztBQUViQyxxQkFBYSxxQkFGQTtBQUdiQyxvQkFBWTtBQUhDLEtBckJyQjs7QUE0QkFKLHVCQUNLSyxTQURMLENBQ2UsR0FEZjtBQUdQLENBbENEOzs7QUNkQVQsUUFBUUMsTUFBUixDQUFlLFlBQWYsRUFBNkJTLE9BQTdCLENBQXFDLFVBQXJDLEVBQWlELFVBQVNDLEtBQVQsRUFBZTs7QUFFOUQsT0FBS0MsY0FBTCxHQUFzQixV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QUpEO0FBS0QsR0FQRDs7QUFTRWIsV0FBUzFCLG9CQUFULEdBQWdDUCxJQUFoQyxDQUFxQyxVQUFTQyxRQUFULEVBQWtCO0FBQ3JEOEIsV0FBT2tCLFdBQVAsR0FBcUJoRCxTQUFTRyxJQUE5QjtBQUNBRixZQUFRQyxHQUFSLENBQVk0QixPQUFPa0IsV0FBbkI7QUFDRCxHQUhEO0FBS0gsQ0FoQkQ7OztBQ0FBaEUsUUFBUUMsTUFBUixDQUFlLFlBQWYsRUFBNkJPLFVBQTdCLENBQXdDLFdBQXhDLEVBQXFELFVBQVNzQyxNQUFULEVBQWlCRSxRQUFqQixFQUEyQkMsWUFBM0IsRUFBd0MsQ0FJNUYsQ0FKRDs7O0FDQUFqRCxRQUFRQyxNQUFSLENBQWUsWUFBZixFQUE2Qk8sVUFBN0IsQ0FBd0MsYUFBeEMsRUFBdUQsVUFBU3NDLE1BQVQsRUFBaUJFLFFBQWpCLEVBQTJCQyxZQUEzQixFQUF3QyxDQUc5RixDQUhEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBsb2dpbiA9IHtcbi8vICAgIHNlY3VyaXR5OiAobWFpblNlcnZpY2UsICRzdGF0ZSkgPT4ge1xuLy8gICAgICByZXR1cm4gbWFpblNlcnZpY2UuZ2V0QXV0aCgpXG4vLyAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbi8vICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4vLyAgICAgICAgICBpZihlcnIuc3RhdHVzID09PSA0MDEpe1xuLy8gICAgICAgICAgICAkc3RhdGUuZ28oXCJsb2dpblwiKTtzXG4vLyAgICAgICAgICB9IGVsc2UgaWYgKGVyci5zdGF0dXMgPT09IDQwMyl7XG4vLyAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XG4vLyAgICAgICAgICB9XG4vLyAgICAgICAgfSlcbi8vICAgIH1cbi8vICB9XG5cbmFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJywgWyd1aS5yb3V0ZXInXSlcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKXtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCIvdmlld3MvaG9tZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9sb2dpbicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiL3ZpZXdzL2xvZ2luLmh0bWxcIixcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5DdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY29sbGVjdGlvbnMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jb2xsZWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvY29sbGVjdGlvbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NvbGxlY3Rpb25zQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kZXRhaWxzLzpjb2xsZWN0aW9uSWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgncHJvZmlsZScse1xuICAgICAgICAgICAgICAgIHVybDonL3Byb2ZpbGUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApe1xuXG4gIHRoaXMuc2VhcmNoTG9jYXRpb24gPSBmdW5jdGlvbihsb2NhdGlvbil7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS9sb2NhdGlvbi8nK2xvY2F0aW9uXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuc2VhcmNoVGVybSA9IGZ1bmN0aW9uKHRlcm0sIGxvY2F0aW9uKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3Rlcm0vJyt0ZXJtKycvJytsb2NhdGlvblxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldFB1YmxpY0NvbGxlY3Rpb25zID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3B1YmxpYy1jb2xsZWN0aW9ucydcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldFVzZXJDb2xsZWN0aW9ucyA9IGZ1bmN0aW9uKHVzZXJJZCl7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS91c2VyLWNvbGxlY3Rpb25zLycrdXNlcklkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsLCB1c2VySWQpe1xuICAgIHZhciBjb2xsZWN0aW9uID0ge1xuICAgICAgTmFtZTogTmFtZSxcbiAgICAgIERlc2NyaXB0aW9uOiBEZXNjcmlwdGlvbixcbiAgICAgIEltYWdldXJsOiBJbWFnZXVybCxcbiAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2NvbGxlY3Rpb25zL2NyZWF0ZScsXG4gICAgICBkYXRhOiBjb2xsZWN0aW9uXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oSWQsIE5hbWUsIERlc2NyaXB0aW9uLCBJbWFnZXVybCwgdXNlcklkKXtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHtcbiAgICAgIE5hbWU6IE5hbWUsXG4gICAgICBEZXNjcmlwdGlvbjogRGVzY3JpcHRpb24sXG4gICAgICBJbWFnZXVybDogSW1hZ2V1cmwsXG4gICAgICB1c2VySWQ6IHVzZXJJZFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2NvbGxlY3Rpb25zL3VwZGF0ZS8nK0lkLFxuICAgICAgZGF0YTogY29sbGVjdGlvblxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5kZWxldGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKCdTRVJWSUNFJywgY29sbGVjdGlvbik7XG4gICAgdmFyIGNvbGxlY3Rpb25JZCA9IGNvbGxlY3Rpb24uaWQ7XG4gICAgY29uc29sZS5sb2coY29sbGVjdGlvbklkKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2NvbGxlY3Rpb25zLycrY29sbGVjdGlvbklkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRSZXN0YXVyYW50ID0gZnVuY3Rpb24ocmVzdGF1cmFudCwgY29sbGVjdGlvbklkKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICByZXN0YXVyYW50OiByZXN0YXVyYW50LFxuICAgICAgY29sbGVjdGlvbklkOiBjb2xsZWN0aW9uSWRcbiAgICB9XG4gICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvcmVzdGF1cmFudHMvYWRkJyxcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMuZ2V0UmVzdGF1cmFudENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uSWQpe1xuICAgIGNvbnNvbGUubG9nKGNvbGxlY3Rpb25JZCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS9yZXN0YXVyYW50cy8nK2NvbGxlY3Rpb25JZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMucmVtb3ZlUmVzdGF1cmFudCA9IGZ1bmN0aW9uKHJlc3RhdXJhbnQpIHtcbiAgICBjb25zb2xlLmxvZyhyZXN0YXVyYW50KTtcbiAgICAvLyB2YXIgSWQgPSByZXN0YXVyYW50LmlkO1xuICAgIHZhciByZXN0YXVyYW50SWQgPSByZXN0YXVyYW50LmlkO1xuICAgIGNvbnNvbGUubG9nKHJlc3RhdXJhbnRJZClcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3Jlc3RhdXJhbnRzLycrcmVzdGF1cmFudElkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cblxuICB2YXIgbWUgPSB0aGlzO1xuICB0aGlzLmdldFVzZXJQcm9maWxlID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgIGlmKG1lLmN1cnJlbnRVc2VyKVxuICAgICAgY2FsbGJhY2sobWUuY3VycmVudFVzZXIpO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvdXNlci1wcm9maWxlLydcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIG1lLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGNhbGxiYWNrKG1lLmN1cnJlbnRVc2VyKTtcbiAgICB9KVxuICB9XG5cblxuXG5cblxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N1c3RlbmFuY2UnKS5jb250cm9sbGVyKCdjb2xsZWN0aW9uc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4kc2NvcGUucmVmcmVzaCA9IGZ1bmN0aW9uKCl7XG5cblxuXG4gIG1haW5TcnZjLmdldFB1YmxpY0NvbGxlY3Rpb25zKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLnB1YmxpY19jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnB1YmxpY19jb2xsZWN0aW9ucyk7XG4gIH0pO1xuXG4gICRzY29wZS5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsKSB7XG4gICAgbWFpblNydmMuY3JlYXRlQ29sbGVjdGlvbihOYW1lLCBEZXNjcmlwdGlvbiwgSW1hZ2V1cmwsICRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcmlkKTtcbiAgICAkc2NvcGUuY29sbGVjdGlvbl9uYW1lID0gJyc7XG4gICAgJHNjb3BlLmNvbGxlY3Rpb25fZGVzY3JpcHRpb24gPSAnJztcbiAgICAkc2NvcGUuY29sbGVjdGlvbl9pbWFnZXVybCA9ICcnO1xuICB9XG5cbiAgJHNjb3BlLmRlbGV0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uKXtcbiAgICBjb25zb2xlLmxvZygnQ09OVFJPTCcsIGNvbGxlY3Rpb24pO1xuICAgIG1haW5TcnZjLmRlbGV0ZUNvbGxlY3Rpb24oY29sbGVjdGlvbikudGhlbihmdW5jdGlvbigpe1xuICAgICAgbWFpblNydmMuZ2V0UHVibGljQ29sbGVjdGlvbnMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLnB1YmxpY19jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwdWJsaWMnLCByZXNwb25zZS5kYXRhKTtcbiAgICAgIH0pO1xuICAgICAgbWFpblNydmMuZ2V0VXNlckNvbGxlY3Rpb25zKCRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcmlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLnVzZXJfY29sbGVjdGlvbnMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudXNlcl9jb2xsZWN0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW5TcnZjLmdldFVzZXJQcm9maWxlKGZ1bmN0aW9uKGN1cnJlbnRVc2VyKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ0ZJUkVEJywgY3VycmVudFVzZXIpO1xuICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBjdXJyZW50VXNlcjtcbiAgICBtYWluU3J2Yy5nZXRVc2VyQ29sbGVjdGlvbnMoJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHNjb3BlLnVzZXJfY29sbGVjdGlvbnMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnVzZXJfY29sbGVjdGlvbnMpO1xuICAgIH0pO1xuICB9KTtcblxuXG59O1xuJHNjb3BlLnJlZnJlc2goKTtcblxuXG5cblxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N1c3RlbmFuY2UnKS5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgJHNjb3BlLnVwZGF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihOYW1lLCBEZXNjcmlwdGlvbiwgSW1hZ2V1cmwpIHtcbiAgICBtYWluU3J2Yy51cGRhdGVDb2xsZWN0aW9uKCRzdGF0ZVBhcmFtcy5jb2xsZWN0aW9uSWQsIE5hbWUsIERlc2NyaXB0aW9uLCBJbWFnZXVybCwgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyaWQpO1xuICAgICRzY29wZS5jb2xsZWN0aW9uX25hbWUgPSAnJztcbiAgICAkc2NvcGUuY29sbGVjdGlvbl9kZXNjcmlwdGlvbiA9ICcnO1xuICAgICRzY29wZS5jb2xsZWN0aW9uX2ltYWdldXJsID0gJyc7XG4gICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyaWQpO1xuICB9XG5cblxuICAkc2NvcGUuc2VhcmNoVGVybSA9IGZ1bmN0aW9uKHRlcm0sIGxvY2F0aW9uKSB7XG4gICAgY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgIGNvbnNvbGUubG9nKHRlcm0pO1xuICAgIG1haW5TcnZjLnNlYXJjaFRlcm0odGVybSwgbG9jYXRpb24pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHNjb3BlLnJlc3RhdXJhbnRzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KTtcbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5yZXN0YXVyYW50cy5idXNpbmVzc2VzKTtcbiAgICAgIHJldHVybiAkc2NvcGUucmVzdGF1cmFudHMuYnVzaW5lc3NlcztcbiAgICB9KTtcbiAgfTtcblxuICBjb25zb2xlLmxvZygkcm9vdFNjb3BlKTtcblxuICBtYWluU3J2Yy5nZXRSZXN0YXVyYW50Q29sbGVjdGlvbigkc3RhdGVQYXJhbXMuY29sbGVjdGlvbklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUucmVzdGF1cmFudENvbGxlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5yZXN0YXVyYW50Q29sbGVjdGlvbik7XG4gIH0pO1xuXG4gICRzY29wZS5hZGRSZXN0YXVyYW50ID0gZnVuY3Rpb24ocmVzdGF1cmFudCl7XG4gICAgbWFpblNydmMuYWRkUmVzdGF1cmFudChyZXN0YXVyYW50LCAkc3RhdGVQYXJhbXMuY29sbGVjdGlvbklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICRzY29wZS5hZGQgPSByZXNwb25zZS5ib2R5O1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5yZW1vdmVSZXN0YXVyYW50ID0gZnVuY3Rpb24ocmVzdGF1cmFudCl7XG4gICAgY29uc29sZS5sb2cocmVzdGF1cmFudCk7XG4gICAgbWFpblNydmMucmVtb3ZlUmVzdGF1cmFudChyZXN0YXVyYW50KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICBtYWluU3J2Yy5nZXRSZXN0YXVyYW50Q29sbGVjdGlvbigkc3RhdGVQYXJhbXMuY29sbGVjdGlvbklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLnJlc3RhdXJhbnRDb2xsZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnJlc3RhdXJhbnRDb2xsZWN0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICAkc2NvcGUuc2VhcmNoTG9jYXRpb24gPSBmdW5jdGlvbihsb2NhdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICBtYWluU3J2Yy5zZWFyY2hMb2NhdGlvbihsb2NhdGlvbikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUucmVzdGF1cmFudHMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnJlc3RhdXJhbnRzLmJ1c2luZXNzZXMpO1xuICAgICAgcmV0dXJuICRzY29wZS5yZXN0YXVyYW50cy5idXNpbmVzc2VzO1xuICAgIH0pO1xuICB9O1xuXG4gICAgbWFpblNydmMuZ2V0UHVibGljQ29sbGVjdGlvbnMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUuY29sbGVjdGlvbnMpO1xuICAgIH0pO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJykuY29udHJvbGxlcignbG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N1c3RlbmFuY2UnKS5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxufSk7XG4iXX0=
