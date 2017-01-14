angular.module('sustenance').controller('collectionsCtrl', function($scope, $rootScope, mainSrvc, $stateParams){

$scope.refresh = function(){



  mainSrvc.getPublicCollections().then(function(response){
    $scope.public_collections = response.data;
    console.log($scope.public_collections);
  });

  $scope.createCollection = function(Name, Description, Imageurl) {
    mainSrvc.createCollection(Name, Description, Imageurl, $rootScope.currentUser.userid);
    $scope.collection_name = '';
    $scope.collection_description = '';
    $scope.collection_imageurl = '';
  }

  $scope.deleteCollection = function(collection){
    console.log(collection);
    mainSrvc.deleteCollection(collection).then(function(){
      mainSrvc.getPublicCollections().then(function(response){
        $scope.public_collections = response.data;
      });
    })
  }

mainSrvc.getUserProfile(function(currentUser) {
  console.log('FIRED', currentUser);
  $rootScope.currentUser = currentUser;
  mainSrvc.getUserCollections($rootScope.currentUser.userid).then(function(response){
    $scope.user_collections = response.data;
    console.log($scope.user_collections);
  });
});


};
$scope.refresh();






});
