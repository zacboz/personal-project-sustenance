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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImxvZ2luU3RhdHVzLmpzIiwibWFpblNydmMuanMiLCJjb250cm9sbGVycy9jb2xsZWN0aW9uc0N0cmwuanMiLCJjb250cm9sbGVycy9kZXRhaWxzQ3RybC5qcyIsImNvbnRyb2xsZXJzL2hvbWVDdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW5DdHJsLmpzIiwiY29udHJvbGxlcnMvcHJvZmlsZUN0cmwuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJkaXJlY3RpdmUiLCJ0ZW1wbGF0ZSIsInNjb3BlIiwiJHNjb3BlIiwibWFpblNydmMiLCIkcm9vdFNjb3BlIiwiJHN0YXRlIiwiY29uc29sZSIsImxvZyIsImxvZ291dCIsImdldExvZ291dCIsInRoZW4iLCJnbyIsImN1cnJlbnRVc2VyIiwiJHdhdGNoIiwibmV3VmFsIiwiaXNMb2dnZWRJbiIsInNlcnZpY2UiLCIkaHR0cCIsInNlYXJjaExvY2F0aW9uIiwibG9jYXRpb24iLCJtZXRob2QiLCJyZXNwb25zZSIsImRhdGEiLCJzZWFyY2hUZXJtIiwidGVybSIsImdldFB1YmxpY0NvbGxlY3Rpb25zIiwiZ2V0VXNlckNvbGxlY3Rpb25zIiwidXNlcklkIiwiY3JlYXRlQ29sbGVjdGlvbiIsIk5hbWUiLCJEZXNjcmlwdGlvbiIsIkltYWdldXJsIiwiY29sbGVjdGlvbiIsInN1Y2Nlc3MiLCJ1cGRhdGVDb2xsZWN0aW9uIiwiSWQiLCJkZWxldGVDb2xsZWN0aW9uIiwiY29sbGVjdGlvbklkIiwiaWQiLCJhZGRSZXN0YXVyYW50IiwicmVzdGF1cmFudCIsInBheWxvYWQiLCJnZXRSZXN0YXVyYW50Q29sbGVjdGlvbiIsInJlbW92ZVJlc3RhdXJhbnQiLCJyZXN0YXVyYW50SWQiLCJtZSIsImdldFVzZXJQcm9maWxlIiwiY2FsbGJhY2siLCIkc3RhdGVQYXJhbXMiLCJyZWZyZXNoIiwicHVibGljX2NvbGxlY3Rpb25zIiwidXNlcmlkIiwiY29sbGVjdGlvbl9uYW1lIiwiY29sbGVjdGlvbl9kZXNjcmlwdGlvbiIsImNvbGxlY3Rpb25faW1hZ2V1cmwiLCJ1c2VyX2NvbGxlY3Rpb25zIiwicmVzdGF1cmFudHMiLCJKU09OIiwicGFyc2UiLCJib2R5IiwiYnVzaW5lc3NlcyIsInJlc3RhdXJhbnRDb2xsZWN0aW9uIiwiYWRkIiwiY29sbGVjdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLFFBQVFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCLENBQUMsV0FBRCxDQUE3QixFQUNLQyxNQURMLENBQ1ksVUFBVUMsY0FBVixFQUEwQkMsa0JBQTFCLEVBQTZDOztBQUVqREQsbUJBQ0tFLEtBREwsQ0FDVyxNQURYLEVBQ2tCO0FBQ1ZDLGFBQUksR0FETTtBQUVWQyxxQkFBYSxrQkFGSDtBQUdWQyxvQkFBWTtBQUhGLEtBRGxCLEVBTUtILEtBTkwsQ0FNVyxPQU5YLEVBTW1CO0FBQ1hDLGFBQUksUUFETztBQUVYQyxxQkFBYSxtQkFGRjtBQUdYQyxvQkFBWTtBQUhELEtBTm5CLEVBV0tILEtBWEwsQ0FXVyxhQVhYLEVBV3lCO0FBQ2pCQyxhQUFJLGNBRGE7QUFFakJDLHFCQUFhLHlCQUZJO0FBR2pCQyxvQkFBWTtBQUhLLEtBWHpCLEVBZ0JLSCxLQWhCTCxDQWdCVyxTQWhCWCxFQWdCcUI7QUFDYkMsYUFBSSx3QkFEUztBQUViQyxxQkFBYSxxQkFGQTtBQUdiQyxvQkFBWTtBQUhDLEtBaEJyQixFQXFCS0gsS0FyQkwsQ0FxQlcsU0FyQlgsRUFxQnFCO0FBQ2JDLGFBQUksVUFEUztBQUViQyxxQkFBYSxxQkFGQTtBQUdiQyxvQkFBWTtBQUhDLEtBckJyQjs7QUE0QkFKLHVCQUNLSyxTQURMLENBQ2UsR0FE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LEVBQXdDOztBQUUxRjlDLFNBQU9nQixjQUFQLEdBQXdCLFVBQVNDLFFBQVQsRUFBbUI7QUFDekNiLFlBQVFDLEdBQVIsQ0FBWVksUUFBWjtBQUNBaEIsYUFBU2UsY0FBVCxDQUF3QkMsUUFBeEIsRUFBa0NULElBQWxDLENBQXVDLFVBQVNXLFFBQVQsRUFBa0I7QUFDdkRuQixhQUFPc0QsV0FBUCxHQUFxQkMsS0FBS0MsS0FBTCxDQUFXckMsU0FBU3NDLElBQXBCLENBQXJCO0FBQ0FyRCxjQUFRQyxHQUFSLENBQVlMLE9BQU9zRCxXQUFQLENBQW1CSSxVQUEvQjtBQUNBLGFBQU8xRCxPQUFPc0QsV0FBUCxDQUFtQkksVUFBMUI7QUFDRCxLQUpEO0FBS0QsR0FQRDs7QUFTRXpELFdBQVNzQixvQkFBVCxHQUFnQ2YsSUFBaEMsQ0FBcUMsVUFBU1csUUFBVCxFQUFrQjtBQUNyRG5CLFdBQU82RCxXQUFQLEdBQXFCMUMsU0FBU0MsSUFBOUI7QUFDQWhCLFlBQVFDLEdBQVIsQ0FBWUwsT0FBTzZELFdBQW5CO0FBQ0QsR0FIRDtBQUtILENBaEJEOzs7QUNBQTFFLFFBQVFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCTyxVQUE3QixDQUF3QyxXQUF4QyxFQUFxRCxVQUFTSyxNQUFULEVBQWlCQyxRQUFqQixFQUEyQjZDLFlBQTNCLEVBQXdDLENBSTVGLENBSkQ7OztBQ0FBM0QsUUFBUUMsTUFBUixDQUFlLFlBQWYsRUFBNkJPLFVBQTdCLENBQXdDLGFBQXhDLEVBQXVELFVBQVNLLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCNkMsWUFBM0IsRUFBd0MsQ0FHOUYsQ0FIRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgbG9naW4gPSB7XG4vLyAgICBzZWN1cml0eTogKG1haW5TZXJ2aWNlLCAkc3RhdGUpID0+IHtcbi8vICAgICAgcmV0dXJuIG1haW5TZXJ2aWNlLmdldEF1dGgoKVxuLy8gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4vLyAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuLy8gICAgICAgICAgaWYoZXJyLnN0YXR1cyA9PT0gNDAxKXtcbi8vICAgICAgICAgICAgJHN0YXRlLmdvKFwibG9naW5cIik7c1xuLy8gICAgICAgICAgfSBlbHNlIGlmIChlcnIuc3RhdHVzID09PSA0MDMpe1xuLy8gICAgICAgICAgICAkc3RhdGUuZ28oXCJob21lXCIpO1xuLy8gICAgICAgICAgfVxuLy8gICAgICAgIH0pXG4vLyAgICB9XG4vLyAgfVxuXG5hbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScsIFsndWkucm91dGVyJ10pXG4gICAgLmNvbmZpZyhmdW5jdGlvbiggJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiL3ZpZXdzL2hvbWUuaHRtbFwiLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdob21lQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbG9naW4nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIi92aWV3cy9sb2dpbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbGxlY3Rpb25zJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY29sbGVjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2NvbGxlY3Rpb25zLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjb2xsZWN0aW9uc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdkZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZGV0YWlscy86Y29sbGVjdGlvbklkJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3Byb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9wcm9maWxlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N1c3RlbmFuY2UnKS5kaXJlY3RpdmUoJ2xvZ2luU3RhdHVzJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJsb2dvdXQtZXZlbnRcIiBuZy1zaG93PVwiaXNMb2dnZWRJblwiIG5nLWNsaWNrPVwibG9nb3V0KClcIj5Mb2dvdXQ8L2Rpdj48ZGl2IGNsYXNzPVwibG9naW4tZXZlbnRcIiB1aS1zcmVmPVwibG9naW5cIiBuZy1oaWRlPVwiaXNMb2dnZWRJblwiPkxvZ2luPC9kaXY+JyxcbiAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkcm9vdFNjb3BlLCAkc3RhdGUpIHtcbiAgICAgICAgICAvLyAkc2NvcGUuaXNMb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUpO1xuICAgICAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbWFpblNydmMuZ2V0TG9nb3V0KCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnY3VycmVudFVzZXInLCBmdW5jdGlvbihuZXdWYWwpIHtcbiAgICAgICAgICAgIGlmKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAkc2NvcGUuaXNMb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkc2NvcGUuaXNMb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApe1xuXG4gIHRoaXMuc2VhcmNoTG9jYXRpb24gPSBmdW5jdGlvbihsb2NhdGlvbil7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS9sb2NhdGlvbi8nK2xvY2F0aW9uXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuc2VhcmNoVGVybSA9IGZ1bmN0aW9uKHRlcm0sIGxvY2F0aW9uKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3Rlcm0vJyt0ZXJtKycvJytsb2NhdGlvblxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldFB1YmxpY0NvbGxlY3Rpb25zID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3B1YmxpYy1jb2xsZWN0aW9ucydcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldFVzZXJDb2xsZWN0aW9ucyA9IGZ1bmN0aW9uKHVzZXJJZCl7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS91c2VyLWNvbGxlY3Rpb25zLycrdXNlcklkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5jcmVhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsLCB1c2VySWQpe1xuICAgIHZhciBjb2xsZWN0aW9uID0ge1xuICAgICAgTmFtZTogTmFtZSxcbiAgICAgIERlc2NyaXB0aW9uOiBEZXNjcmlwdGlvbixcbiAgICAgIEltYWdldXJsOiBJbWFnZXVybCxcbiAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2NvbGxlY3Rpb25zL2NyZWF0ZScsXG4gICAgICBkYXRhOiBjb2xsZWN0aW9uXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oSWQsIE5hbWUsIERlc2NyaXB0aW9uLCBJbWFnZXVybCwgdXNlcklkKXtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHtcbiAgICAgIE5hbWU6IE5hbWUsXG4gICAgICBEZXNjcmlwdGlvbjogRGVzY3JpcHRpb24sXG4gICAgICBJbWFnZXVybDogSW1hZ2V1cmwsXG4gICAgICB1c2VySWQ6IHVzZXJJZFxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2NvbGxlY3Rpb25zL3VwZGF0ZS8nK0lkLFxuICAgICAgZGF0YTogY29sbGVjdGlvblxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5kZWxldGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKCdTRVJWSUNFJywgY29sbGVjdGlvbik7XG4gICAgdmFyIGNvbGxlY3Rpb25JZCA9IGNvbGxlY3Rpb24uaWQ7XG4gICAgY29uc29sZS5sb2coY29sbGVjdGlvbklkKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL2NvbGxlY3Rpb25zLycrY29sbGVjdGlvbklkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRSZXN0YXVyYW50ID0gZnVuY3Rpb24ocmVzdGF1cmFudCwgY29sbGVjdGlvbklkKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICByZXN0YXVyYW50OiByZXN0YXVyYW50LFxuICAgICAgY29sbGVjdGlvbklkOiBjb2xsZWN0aW9uSWRcbiAgICB9XG4gICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvcmVzdGF1cmFudHMvYWRkJyxcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoaXMuZ2V0UmVzdGF1cmFudENvbGxlY3Rpb24gPSBmdW5jdGlvbihjb2xsZWN0aW9uSWQpe1xuICAgIGNvbnNvbGUubG9nKGNvbGxlY3Rpb25JZCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VzdGVuYW5jZS9yZXN0YXVyYW50cy8nK2NvbGxlY3Rpb25JZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMucmVtb3ZlUmVzdGF1cmFudCA9IGZ1bmN0aW9uKHJlc3RhdXJhbnQpIHtcbiAgICBjb25zb2xlLmxvZyhyZXN0YXVyYW50KTtcbiAgICAvLyB2YXIgSWQgPSByZXN0YXVyYW50LmlkO1xuICAgIHZhciByZXN0YXVyYW50SWQgPSByZXN0YXVyYW50LmlkO1xuICAgIGNvbnNvbGUubG9nKHJlc3RhdXJhbnRJZClcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9zdXN0ZW5hbmNlL3Jlc3RhdXJhbnRzLycrcmVzdGF1cmFudElkXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cblxuICB2YXIgbWUgPSB0aGlzO1xuICB0aGlzLmdldFVzZXJQcm9maWxlID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgIGlmKG1lLmN1cnJlbnRVc2VyKVxuICAgICAgY2FsbGJhY2sobWUuY3VycmVudFVzZXIpO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1c3RlbmFuY2UvdXNlci1wcm9maWxlLydcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIG1lLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGNhbGxiYWNrKG1lLmN1cnJlbnRVc2VyKTtcbiAgICB9KVxuICB9XG5cbiAgdGhpcy5nZXRMb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2xvZ291dCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXJ2aWNlIGZpcmluZycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG5cblxuXG5cblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJykuY29udHJvbGxlcignY29sbGVjdGlvbnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuJHNjb3BlLnJlZnJlc2ggPSBmdW5jdGlvbigpe1xuXG5cblxuICBtYWluU3J2Yy5nZXRQdWJsaWNDb2xsZWN0aW9ucygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5wdWJsaWNfY29sbGVjdGlvbnMgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5wdWJsaWNfY29sbGVjdGlvbnMpO1xuICB9KTtcblxuICAkc2NvcGUuY3JlYXRlQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKE5hbWUsIERlc2NyaXB0aW9uLCBJbWFnZXVybCkge1xuICAgIG1haW5TcnZjLmNyZWF0ZUNvbGxlY3Rpb24oTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsLCAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJpZCk7XG4gICAgJHNjb3BlLmNvbGxlY3Rpb25fbmFtZSA9ICcnO1xuICAgICRzY29wZS5jb2xsZWN0aW9uX2Rlc2NyaXB0aW9uID0gJyc7XG4gICAgJHNjb3BlLmNvbGxlY3Rpb25faW1hZ2V1cmwgPSAnJztcbiAgfVxuXG4gICRzY29wZS5kZWxldGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oY29sbGVjdGlvbil7XG4gICAgY29uc29sZS5sb2coJ0NPTlRST0wnLCBjb2xsZWN0aW9uKTtcbiAgICBtYWluU3J2Yy5kZWxldGVDb2xsZWN0aW9uKGNvbGxlY3Rpb24pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgIG1haW5TcnZjLmdldFB1YmxpY0NvbGxlY3Rpb25zKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICRzY29wZS5wdWJsaWNfY29sbGVjdGlvbnMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICBjb25zb2xlLmxvZygncHVibGljJywgcmVzcG9uc2UuZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIG1haW5TcnZjLmdldFVzZXJDb2xsZWN0aW9ucygkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICRzY29wZS51c2VyX2NvbGxlY3Rpb25zID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnVzZXJfY29sbGVjdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBtYWluU3J2Yy5nZXRVc2VyUHJvZmlsZShmdW5jdGlvbihjdXJyZW50VXNlcikge1xuICAgIC8vIGNvbnNvbGUubG9nKCdGSVJFRCcsIGN1cnJlbnRVc2VyKTtcbiAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XG4gICAgbWFpblNydmMuZ2V0VXNlckNvbGxlY3Rpb25zKCRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcmlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS51c2VyX2NvbGxlY3Rpb25zID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS51c2VyX2NvbGxlY3Rpb25zKTtcbiAgICB9KTtcbiAgfSk7XG5cblxufTtcbiRzY29wZS5yZWZyZXNoKCk7XG5cblxuXG5cblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJykuY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpe1xuXG4gICRzY29wZS51cGRhdGVDb2xsZWN0aW9uID0gZnVuY3Rpb24oTmFtZSwgRGVzY3JpcHRpb24sIEltYWdldXJsKSB7XG4gICAgbWFpblNydmMudXBkYXRlQ29sbGVjdGlvbigkc3RhdGVQYXJhbXMuY29sbGVjdGlvbklkLCBOYW1lLCBEZXNjcmlwdGlvbiwgSW1hZ2V1cmwsICRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcmlkKTtcbiAgICAkc2NvcGUuY29sbGVjdGlvbl9uYW1lID0gJyc7XG4gICAgJHNjb3BlLmNvbGxlY3Rpb25fZGVzY3JpcHRpb24gPSAnJztcbiAgICAkc2NvcGUuY29sbGVjdGlvbl9pbWFnZXVybCA9ICcnO1xuICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcmlkKTtcbiAgfVxuXG5cbiAgJHNjb3BlLnNlYXJjaFRlcm0gPSBmdW5jdGlvbih0ZXJtLCBsb2NhdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICBjb25zb2xlLmxvZyh0ZXJtKTtcbiAgICBtYWluU3J2Yy5zZWFyY2hUZXJtKHRlcm0sIGxvY2F0aW9uKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5yZXN0YXVyYW50cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUucmVzdGF1cmFudHMuYnVzaW5lc3Nlcyk7XG4gICAgICByZXR1cm4gJHNjb3BlLnJlc3RhdXJhbnRzLmJ1c2luZXNzZXM7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc29sZS5sb2coJHJvb3RTY29wZSk7XG5cbiAgbWFpblNydmMuZ2V0UmVzdGF1cmFudENvbGxlY3Rpb24oJHN0YXRlUGFyYW1zLmNvbGxlY3Rpb25JZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLnJlc3RhdXJhbnRDb2xsZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUucmVzdGF1cmFudENvbGxlY3Rpb24pO1xuICB9KTtcblxuICAkc2NvcGUuYWRkUmVzdGF1cmFudCA9IGZ1bmN0aW9uKHJlc3RhdXJhbnQpe1xuICAgIG1haW5TcnZjLmFkZFJlc3RhdXJhbnQocmVzdGF1cmFudCwgJHN0YXRlUGFyYW1zLmNvbGxlY3Rpb25JZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAkc2NvcGUuYWRkID0gcmVzcG9uc2UuYm9keTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUucmVtb3ZlUmVzdGF1cmFudCA9IGZ1bmN0aW9uKHJlc3RhdXJhbnQpe1xuICAgIGNvbnNvbGUubG9nKHJlc3RhdXJhbnQpO1xuICAgIG1haW5TcnZjLnJlbW92ZVJlc3RhdXJhbnQocmVzdGF1cmFudCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgbWFpblNydmMuZ2V0UmVzdGF1cmFudENvbGxlY3Rpb24oJHN0YXRlUGFyYW1zLmNvbGxlY3Rpb25JZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICRzY29wZS5yZXN0YXVyYW50Q29sbGVjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5yZXN0YXVyYW50Q29sbGVjdGlvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBpZighJHJvb3RTY29wZS5jdXJyZW50VXNlcikge1xuICAgIG1haW5TcnZjLmdldFVzZXJQcm9maWxlKGZ1bmN0aW9uKGN1cnJlbnRVc2VyKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnRklSRUQnLCBjdXJyZW50VXNlcik7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XG4gICAgICBtYWluU3J2Yy5nZXRVc2VyQ29sbGVjdGlvbnMoJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUudXNlcl9jb2xsZWN0aW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS51c2VyX2NvbGxlY3Rpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdXN0ZW5hbmNlJykuY29udHJvbGxlcignaG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gICRzY29wZS5zZWFyY2hMb2NhdGlvbiA9IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgIG1haW5TcnZjLnNlYXJjaExvY2F0aW9uKGxvY2F0aW9uKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5yZXN0YXVyYW50cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUucmVzdGF1cmFudHMuYnVzaW5lc3Nlcyk7XG4gICAgICByZXR1cm4gJHNjb3BlLnJlc3RhdXJhbnRzLmJ1c2luZXNzZXM7XG4gICAgfSk7XG4gIH07XG5cbiAgICBtYWluU3J2Yy5nZXRQdWJsaWNDb2xsZWN0aW9ucygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHNjb3BlLmNvbGxlY3Rpb25zID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jb2xsZWN0aW9ucyk7XG4gICAgfSk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N1c3RlbmFuY2UnKS5jb250cm9sbGVyKCdsb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3VzdGVuYW5jZScpLmNvbnRyb2xsZXIoJ3Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG59KTtcbiJdfQ==
