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

angular.module('sustenance').directive('loginStatus', function () {

  return {
    template: '<div class="logout-event" ng-show="isLoggedIn" ng-click="logout()">Logout</div><div class="login-event" ui-sref="login" ng-hide="isLoggedIn">Login</div>',
    scope: {},
    controller: function controller($scope, mainSrvc, $rootScope, $state) {
      // $scope.isLoggedIn = false;
      console.log($rootScope);
      $scope.logout = function () {
        mainSrvc.getLogout().then(function () {
          $state.go('home');
          $rootScope.currentUser = null;
        });
      };

      $rootScope.$watch('currentUser', function (newVal) {
        if (newVal) {
          $scope.isLoggedIn = true;
        } else {
          $scope.isLoggedIn = false;
        }
      });
    }
  };
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
      for (var i = 0; i < response.data.length; i++) {
        for (var j = 0; j < response.data[i].categories.length; j++) {
          response.data[i].categories[j] = JSON.parse(response.data[i].categories[j]);
        }
      }
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

  this.getLogout = function () {
    return $http({
      method: 'GET',
      url: '/logout'
    }).then(function (response) {
      console.log('service firing', response);
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

  $scope.refresh = function () {

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
        console.log('31', response);
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

    if (!$rootScope.currentUser) {
      mainSrvc.getUserProfile(function (currentUser) {
        // console.log('FIRED', currentUser);
        $rootScope.currentUser = currentUser;
        mainSrvc.getUserCollections($rootScope.currentUser.userid).then(function (response) {
          $scope.user_collections = response.data;
          // console.log($scope.user_collections);
        });
      });
    }
  };
  $scope.refresh();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImxvZ2luU3RhdHVzLmpzIiwibWFpblNydmMuanMiLCJjb250cm9sbGVycy9jb2xsZWN0aW9uc0N0cmwuanMiLCJjb250cm9sbGVycy9kZXRhaWxzQ3RybC5qcyIsImNvbnRyb2xsZXJzL2hvbWVDdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW5DdHJsLmpzIiwiY29udHJvbGxlcnMvcHJvZmlsZUN0cmwuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJkaXJlY3RpdmUiLCJ0ZW1wbGF0ZSIsInNjb3BlIiwiJHNjb3BlIiwibWFpblNydmMiLCIkcm9vdFNjb3BlIiwiJHN0YXRlIiwiY29uc29sZSIsImxvZyIsImxvZ291dCIsImdldExvZ291dCIsInRoZW4iLCJnbyIsImN1cnJlbnRVc2VyIiwiJHdhdGNoIiwibmV3VmFsIiwiaXNMb2dnZWRJbiIsInNlcnZpY2UiLCIkaHR0cCIsInNlYXJjaExvY2F0aW9uIiwibG9jYXRpb24iLCJtZXRob2QiLCJyZXNwb25zZSIsImRhdGEiLCJzZWFyY2hUZXJtIiwidGVybSIsImdldFB1YmxpY0NvbGxlY3Rpb25zIiwiZ2V0VXNlckNvbGxlY3Rpb25zIiwidXNlcklkIiwiY3JlYXRlQ29sbGVjdGlvbiIsIk5hbWUiLCJEZXNjcmlwdGlvbiIsIkltYWdldXJsIiwiY29sbGVjdGlvbiIsInN1Y2Nlc3MiLCJ1cGRhdGVDb2xsZWN0aW9uIiwiSWQiLCJkZWxldGVDb2xsZWN0aW9uIiwiY29sbGVjdGlvbklkIiwiaWQiLCJhZGRSZXN0YXVyYW50IiwicmVzdGF1cmFudCIsInBheWxvYWQiLCJnZXRSZXN0YXVyYW50Q29sbGVjdGlvbiIsImkiLCJsZW5ndGgiLCJqIiwiY2F0ZWdvcmllcyIsIkpTT04iLCJwYXJzZSIsInJlbW92ZVJlc3RhdXJhbnQiLCJyZXN0YXVyYW50SWQiLCJtZSIsImdldFVzZXJQcm9maWxlIiwiY2FsbGJhY2siLCIkc3RhdGVQYXJhbXMiLCJyZWZyZXNoIiwicHVibGljX2NvbGxlY3Rpb25zIiwidXNlcmlkIiwiY29sbGVjdGlvbl9uYW1lIiwiY29sbGVjdGlvbl9kZXNjcmlwdGlvbiIsImNvbGxlY3Rpb25faW1hZ2V1cmwiLCJ1c2VyX2NvbGxlY3Rpb25zIiwicmVzdGF1cmFudHMiLCJib2R5IiwiYnVzaW5lc3NlcyIsInJlc3RhdXJhbnRDb2xsZWN0aW9uIiwiYWRkIiwiY29sbGVjdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLFFBQVFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCLENBQUMsV0FBRCxDQUE3QixFQUNLQyxNQURMLENBQ1ksVUFBVUMsY0FBVixFQUEwQkMsa0JBQTFCLEVBQTZDOztBQUVqREQsbUJBQ0tFLEtBREwsQ0FDVyxNQURYLEVBQ2tCO0FBQ1ZDLGFBQUksR0FETTtBQUVWQyxxQkFBYSxrQkFGSDtBQUdWQyxvQkFBWTtBQUhGLEtBRGxCLEVBTUtILEtBTkwsQ0FNVyxPQU5YLEVBTW1CO0FBQ1hDLGFBQUksUUFETztBQUVYQyxxQkFBYSxtQkFGRjtBQUdYQyxvQkFBWTtBQUhELEtBTm5CLEVBV0tILEtBWEwsQ0FXVyxhQVhYLEVBV3lCO0FBQ2pCQyxhQUFJLGNBRGE7QUFFakJDLHFCQUFhLHlCQUZJO0FBR2pCQyxvQkFBWTtBQUhLLEtBWHpCLEVBZ0JLSCxLQWhCTCxDQWdCVyxTQWhCWCxFQWdCcUI7QUFDYkMsYUFBSSx3QkFEUztBQUViQyxxQkFBYSxxQkFGQTtBQUdiQyxvQkFBWTtBQUhDLEtBaEJyQixFQXFCS0gsS0FyQkwsQ0FxQlcsU0FyQlgsRUFxQnFCO0FBQ2JDLGFBQUksVUFEUztBQUViQyxxQkFBYSxxQkFGQTtBQUdiQyxvQkFBWTtBQUhDLEtBckJy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TCxPQUFPaUUsV0FBbkI7QUFDRCxHQUhEO0FBS0gsQ0FoQkQ7OztBQ0FBOUUsUUFBUUMsTUFBUixDQUFlLFlBQWYsRUFBNkJPLFVBQTdCLENBQXdDLFdBQXhDLEVBQXFELFVBQVNLLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCbUQsWUFBM0IsRUFBd0MsQ0FJNUYsQ0FKRDs7O0FDQUFqRSxRQUFRQyxNQUFSLENBQWUsWUFBZixFQUE2Qk8sVUFBN0IsQ0FBd0MsYUFBeEMsRUFBdUQsVUFBU0ssTUFBVCxFQUFpQkMsUUFBakIsRUFBMkJtRCxZQUEzQixFQUF3QyxDQUc5RixDQUhEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBsb2dpbiA9IHtcbi8vICAgIHNlY3VyaXR5OiAobWFpblNlcnZpY2UsICRzdGF0ZSkgPT4ge1xuLy8gICAgICByZXR1cm4gbWFpblNlcnZpY2UuZ2V0QXV0aCgpXG4vLyAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbi8vICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4vLyAgICAgICAgICBpZihlcnIuc3RhdHVzID09PSA0MDEpe1xuLy8gICAgICAgICAgICAkc3RhdGUuZ28oXCJsb2dpblwiKTtzXG4vLyAgICAgICAgICB9IGVsc2UgaWYgKGVyci5zdGF0dXMgPT09IDQwMyl7XG4vLyAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XG4vLyAgICAgICAgICB9XG4vLyAgICAgICAgfSlcbi8vICAgIH1cbi8vICB9XG5cbmFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJywgWyd1aS5yb3V0ZXInXSlcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKXtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCIvdmlld3MvaG9tZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9sb2dpbicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiL3ZpZXdzL2xvZ2luLmh0bWxcIixcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5DdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY29sbGVjdGlvbnMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jb2xsZWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvY29sbGVjdGlvbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NvbGxlY3Rpb25zQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kZXRhaWxzLzpjb2xsZWN0aW9uSWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgncHJvZmlsZScse1xuICAgICAgICAgICAgICAgIHVybDonL3Byb2ZpbGUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLmRpcmVjdGl2ZSgnbG9naW5TdGF0dXMnLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImxvZ291dC1ldmVudFwiIG5nLXNob3c9XCJpc0xvZ2dlZEluXCIgbmctY2xpY2s9XCJsb2dvdXQoKVwiPkxvZ291dDwvZGl2PjxkaXYgY2xhc3M9XCJsb2dpbi1ldmVudFwiIHVpLXNyZWY9XCJsb2dpblwiIG5nLWhpZGU9XCJpc0xvZ2dlZEluXCI+TG9naW48L2Rpdj4nLFxuICAgICAgICBzY29wZToge30sXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRyb290U2NvcGUsICRzdGF0ZSkge1xuICAgICAgICAgIC8vICRzY29wZS5pc0xvZ2dlZEluID0gZmFsc2U7XG4gICAgICAgICAgY29uc29sZS5sb2coJHJvb3RTY29wZSk7XG4gICAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBtYWluU3J2Yy5nZXRMb2dvdXQoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICRyb290U2NvcGUuJHdhdGNoKCdjdXJyZW50VXNlcicsIGZ1bmN0aW9uKG5ld1ZhbCkge1xuICAgICAgICAgICAgaWYobmV3VmFsKSB7XG4gICAgICAgICAgICAgICRzY29wZS5pc0xvZ2dlZEluID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRzY29wZS5pc0xvZ2dlZEluID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJykuc2VydmljZSgnbWFpblNydmMnLCBmdW5jdGlvbigkaHR0cCl7XG5cbiAgdGhpcy5zZWFyY2hMb2NhdGlvbiA9IGZ1bmN0aW9uKGxvY2F0aW9uKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2xvY2F0aW9uLycrbG9jYXRpb25cbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5zZWFyY2hUZXJtID0gZnVuY3Rpb24odGVybSwgbG9jYXRpb24pe1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvdGVybS8nK3Rlcm0rJy8nK2xvY2F0aW9uXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0UHVibGljQ29sbGVjdGlvbnMgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvcHVibGljLWNvbGxlY3Rpb25zJ1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0VXNlckNvbGxlY3Rpb25zID0gZnVuY3Rpb24odXNlcklkKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3VzZXItY29sbGVjdGlvbnMvJyt1c2VySWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihOYW1lLCBEZXNjcmlwdGlvbiwgSW1hZ2V1cmwsIHVzZXJJZCl7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSB7XG4gICAgICBOYW1lOiBOYW1lLFxuICAgICAgRGVzY3JpcHRpb246IERlc2NyaXB0aW9uLFxuICAgICAgSW1hZ2V1cmw6IEltYWdldXJsLFxuICAgICAgdXNlcklkOiB1c2VySWRcbiAgICB9XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvY29sbGVjdGlvbnMvY3JlYXRlJyxcbiAgICAgIGRhdGE6IGNvbGxlY3Rpb25cbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihJZCwgTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsLCB1c2VySWQpe1xuICAgIHZhciBjb2xsZWN0aW9uID0ge1xuICAgICAgTmFtZTogTmFtZSxcbiAgICAgIERlc2NyaXB0aW9uOiBEZXNjcmlwdGlvbixcbiAgICAgIEltYWdldXJsOiBJbWFnZXVybCxcbiAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvY29sbGVjdGlvbnMvdXBkYXRlLycrSWQsXG4gICAgICBkYXRhOiBjb2xsZWN0aW9uXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZygnU0VSVklDRScsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmRlbGV0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgY29uc29sZS5sb2coJ1NFUlZJQ0UnLCBjb2xsZWN0aW9uKTtcbiAgICB2YXIgY29sbGVjdGlvbklkID0gY29sbGVjdGlvbi5pZDtcbiAgICBjb25zb2xlLmxvZyhjb2xsZWN0aW9uSWQpO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvY29sbGVjdGlvbnMvJytjb2xsZWN0aW9uSWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmFkZFJlc3RhdXJhbnQgPSBmdW5jdGlvbihyZXN0YXVyYW50LCBjb2xsZWN0aW9uSWQpIHtcbiAgICB2YXIgcGF5bG9hZCA9IHtcbiAgICAgIHJlc3RhdXJhbnQ6IHJlc3RhdXJhbnQsXG4gICAgICBjb2xsZWN0aW9uSWQ6IGNvbGxlY3Rpb25JZFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhwYXlsb2FkKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS9yZXN0YXVyYW50cy9hZGQnLFxuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5nZXRSZXN0YXVyYW50Q29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb25JZCl7XG4gICAgY29uc29sZS5sb2coY29sbGVjdGlvbklkKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3Jlc3RhdXJhbnRzLycrY29sbGVjdGlvbklkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXNwb25zZS5kYXRhW2ldLmNhdGVnb3JpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICByZXNwb25zZS5kYXRhW2ldLmNhdGVnb3JpZXNbal0gPSBKU09OLnBhcnNlKHJlc3BvbnNlLmRhdGFbaV0uY2F0ZWdvcmllc1tqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbW92ZVJlc3RhdXJhbnQgPSBmdW5jdGlvbihyZXN0YXVyYW50KSB7XG4gICAgY29uc29sZS5sb2cocmVzdGF1cmFudCk7XG4gICAgLy8gdmFyIElkID0gcmVzdGF1cmFudC5pZDtcbiAgICB2YXIgcmVzdGF1cmFudElkID0gcmVzdGF1cmFudC5pZDtcbiAgICBjb25zb2xlLmxvZyhyZXN0YXVyYW50SWQpXG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS9yZXN0YXVyYW50cy8nK3Jlc3RhdXJhbnRJZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG5cbiAgdmFyIG1lID0gdGhpcztcbiAgdGhpcy5nZXRVc2VyUHJvZmlsZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICBpZihtZS5jdXJyZW50VXNlcilcbiAgICAgIGNhbGxiYWNrKG1lLmN1cnJlbnRVc2VyKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3VzZXItcHJvZmlsZS8nXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBtZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjYWxsYmFjayhtZS5jdXJyZW50VXNlcik7XG4gICAgfSlcbiAgfVxuXG4gIHRoaXMuZ2V0TG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9sb2dvdXQnXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZygnc2VydmljZSBmaXJpbmcnLCByZXNwb25zZSk7XG4gICAgfSlcbiAgfTtcblxuXG5cblxuXG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLmNvbnRyb2xsZXIoJ2NvbGxlY3Rpb25zQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cbiRzY29wZS5yZWZyZXNoID0gZnVuY3Rpb24oKXtcblxuXG5cbiAgbWFpblNydmMuZ2V0UHVibGljQ29sbGVjdGlvbnMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUucHVibGljX2NvbGxlY3Rpb25zID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUucHVibGljX2NvbGxlY3Rpb25zKTtcbiAgfSk7XG5cbiAgJHNjb3BlLmNyZWF0ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbihOYW1lLCBEZXNjcmlwdGlvbiwgSW1hZ2V1cmwpIHtcbiAgICBtYWluU3J2Yy5jcmVhdGVDb2xsZWN0aW9uKE5hbWUsIERlc2NyaXB0aW9uLCBJbWFnZXVybCwgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyaWQpO1xuICAgICRzY29wZS5jb2xsZWN0aW9uX25hbWUgPSAnJztcbiAgICAkc2NvcGUuY29sbGVjdGlvbl9kZXNjcmlwdGlvbiA9ICcnO1xuICAgICRzY29wZS5jb2xsZWN0aW9uX2ltYWdldXJsID0gJyc7XG4gIH1cblxuICAkc2NvcGUuZGVsZXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pe1xuICAgIGNvbnNvbGUubG9nKCdDT05UUk9MJywgY29sbGVjdGlvbik7XG4gICAgbWFpblNydmMuZGVsZXRlQ29sbGVjdGlvbihjb2xsZWN0aW9uKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICBtYWluU3J2Yy5nZXRQdWJsaWNDb2xsZWN0aW9ucygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUucHVibGljX2NvbGxlY3Rpb25zID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgY29uc29sZS5sb2coJ3B1YmxpYycsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgfSk7XG4gICAgICBtYWluU3J2Yy5nZXRVc2VyQ29sbGVjdGlvbnMoJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUudXNlcl9jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS51c2VyX2NvbGxlY3Rpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpblNydmMuZ2V0VXNlclByb2ZpbGUoZnVuY3Rpb24oY3VycmVudFVzZXIpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnRklSRUQnLCBjdXJyZW50VXNlcik7XG4gICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IGN1cnJlbnRVc2VyO1xuICAgIG1haW5TcnZjLmdldFVzZXJDb2xsZWN0aW9ucygkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUudXNlcl9jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudXNlcl9jb2xsZWN0aW9ucyk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbn07XG4kc2NvcGUucmVmcmVzaCgpO1xuXG5cblxuXG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLmNvbnRyb2xsZXIoJ2RldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICAkc2NvcGUucmVmcmVzaCA9IGZ1bmN0aW9uKCl7XG5cblxuICAkc2NvcGUudXBkYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKE5hbWUsIERlc2NyaXB0aW9uLCBJbWFnZXVybCkge1xuICAgIG1haW5TcnZjLnVwZGF0ZUNvbGxlY3Rpb24oJHN0YXRlUGFyYW1zLmNvbGxlY3Rpb25JZCwgTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsLCAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJpZCk7XG4gICAgJHNjb3BlLmNvbGxlY3Rpb25fbmFtZSA9ICcnO1xuICAgICRzY29wZS5jb2xsZWN0aW9uX2Rlc2NyaXB0aW9uID0gJyc7XG4gICAgJHNjb3BlLmNvbGxlY3Rpb25faW1hZ2V1cmwgPSAnJztcbiAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJpZCk7XG4gIH1cblxuXG4gICRzY29wZS5zZWFyY2hUZXJtID0gZnVuY3Rpb24odGVybSwgbG9jYXRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgY29uc29sZS5sb2codGVybSk7XG4gICAgbWFpblNydmMuc2VhcmNoVGVybSh0ZXJtLCBsb2NhdGlvbikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUucmVzdGF1cmFudHMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnJlc3RhdXJhbnRzLmJ1c2luZXNzZXMpO1xuICAgICAgcmV0dXJuICRzY29wZS5yZXN0YXVyYW50cy5idXNpbmVzc2VzO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnNvbGUubG9nKCRyb290U2NvcGUpO1xuXG4gIG1haW5TcnZjLmdldFJlc3RhdXJhbnRDb2xsZWN0aW9uKCRzdGF0ZVBhcmFtcy5jb2xsZWN0aW9uSWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5yZXN0YXVyYW50Q29sbGVjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnJlc3RhdXJhbnRDb2xsZWN0aW9uKTtcbiAgfSk7XG5cbiAgJHNjb3BlLmFkZFJlc3RhdXJhbnQgPSBmdW5jdGlvbihyZXN0YXVyYW50KXtcbiAgICBtYWluU3J2Yy5hZGRSZXN0YXVyYW50KHJlc3RhdXJhbnQsICRzdGF0ZVBhcmFtcy5jb2xsZWN0aW9uSWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2coJzMxJywgcmVzcG9uc2UpO1xuICAgICAgJHNjb3BlLmFkZCA9IHJlc3BvbnNlLmJvZHk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLnJlbW92ZVJlc3RhdXJhbnQgPSBmdW5jdGlvbihyZXN0YXVyYW50KXtcbiAgICBjb25zb2xlLmxvZyhyZXN0YXVyYW50KTtcbiAgICBtYWluU3J2Yy5yZW1vdmVSZXN0YXVyYW50KHJlc3RhdXJhbnQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgIG1haW5TcnZjLmdldFJlc3RhdXJhbnRDb2xsZWN0aW9uKCRzdGF0ZVBhcmFtcy5jb2xsZWN0aW9uSWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUucmVzdGF1cmFudENvbGxlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUucmVzdGF1cmFudENvbGxlY3Rpb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYoISRyb290U2NvcGUuY3VycmVudFVzZXIpIHtcbiAgICBtYWluU3J2Yy5nZXRVc2VyUHJvZmlsZShmdW5jdGlvbihjdXJyZW50VXNlcikge1xuICAgICAgLy8gY29uc29sZS5sb2coJ0ZJUkVEJywgY3VycmVudFVzZXIpO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IGN1cnJlbnRVc2VyO1xuICAgICAgbWFpblNydmMuZ2V0VXNlckNvbGxlY3Rpb25zKCRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcmlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLnVzZXJfY29sbGVjdGlvbnMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudXNlcl9jb2xsZWN0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59O1xuJHNjb3BlLnJlZnJlc2goKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICAkc2NvcGUuc2VhcmNoTG9jYXRpb24gPSBmdW5jdGlvbihsb2NhdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICBtYWluU3J2Yy5zZWFyY2hMb2NhdGlvbihsb2NhdGlvbikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUucmVzdGF1cmFudHMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnJlc3RhdXJhbnRzLmJ1c2luZXNzZXMpO1xuICAgICAgcmV0dXJuICRzY29wZS5yZXN0YXVyYW50cy5idXNpbmVzc2VzO1xuICAgIH0pO1xuICB9O1xuXG4gICAgbWFpblNydmMuZ2V0UHVibGljQ29sbGVjdGlvbnMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUuY29sbGVjdGlvbnMpO1xuICAgIH0pO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJykuY29udHJvbGxlcignbG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N1c3RlbmFuY2UnKS5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxufSk7XG4iXX0=
