angular.module('sustenance').controller('collectionsCtrl', function($scope, mainSrvc, $stateParams){

$scope.test = 'hello world';

  mainSrvc.getPublicCollections().then(function(response){
    $scope.public_collections = response.data;
    console.log($scope.public_collections);
  });

  mainSrvc.getUserCollections().then(function(response){
    $scope.user_collections = response.data;
    console.log($scope.user_collections);
  });

  $scope.createCollection = function(Name, Description, Imageurl, userId) {
    console.log(userId);
    mainSrvc.createCollection(Name, Description, Imageurl, userId);
    $scope.collection_name = '';
    $scope.collection_description = '';
    $scope.collection_imageurl = '';
    $scope.collection_userId= '';
  }

  $scope.deleteCollection = function(collection){
    console.log(collection);
    mainSrvc.deleteCollection(collection).then(function(){
      mainSrvc.getPublicCollections().then(function(response){
        $scope.public_collections = response.data;
      });
    })
  }

});
