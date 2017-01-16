angular.module('sustenance').controller('detailsCtrl', function($scope, mainSrvc, $stateParams, $rootScope){

  $scope.updateCollection = function(Name, Description, Imageurl) {
    mainSrvc.updateCollection($stateParams.collectionId, Name, Description, Imageurl, $rootScope.currentUser.userid);
    $scope.collection_name = '';
    $scope.collection_description = '';
    $scope.collection_imageurl = '';
    console.log($rootScope.currentUser.userid);
  }


  $scope.searchTerm = function(term, location) {
    console.log(location);
    console.log(term);
    mainSrvc.searchTerm(term, location).then(function(response){
      $scope.restaurants = JSON.parse(response.body);
      console.log($scope.restaurants.businesses);
      return $scope.restaurants.businesses;
    });
  };

  console.log($rootScope);

  mainSrvc.getRestaurantCollection($stateParams.collectionId).then(function(response){
    $scope.restaurantCollection = response.data;
    console.log($scope.restaurantCollection);
  });

  $scope.addRestaurant = function(restaurant){
    mainSrvc.addRestaurant(restaurant, $stateParams.collectionId).then(function(response){
      console.log(response);
      $scope.add = response.body;
    });
  };

  $scope.removeRestaurant = function(restaurant){
    console.log(restaurant);
    mainSrvc.removeRestaurant(restaurant).then(function(){
      mainSrvc.getRestaurantCollection($stateParams.collectionId).then(function(response){
        $scope.restaurantCollection = response.data;
        console.log($scope.restaurantCollection);
      });
    });
  };
});
