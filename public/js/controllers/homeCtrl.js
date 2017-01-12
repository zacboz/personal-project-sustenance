angular.module('sustenance').controller('homeCtrl', function($scope, mainSrvc, $stateParams){

  $scope.searchLocation = function(location) {
    console.log(location);
    mainSrvc.searchLocation(location).then(function(response){
      $scope.restaurants = JSON.parse(response.body);
      console.log($scope.restaurants.businesses);
      return $scope.restaurants.businesses;
    });
  };

    mainSrvc.getPublicCollections().then(function(response){
      $scope.collections = response.data;
      console.log($scope.collections);
    });

});
