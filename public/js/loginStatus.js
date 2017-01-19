angular.module('sustenance').directive('loginStatus', function() {

    return {
        template: '<div class="logout-event" ng-show="isLoggedIn" ng-click="logout()">Logout</div><div class="login-event" ui-sref="login" ng-hide="isLoggedIn">Login</div>',
        scope: {},
        controller: function($scope, mainSrvc, $rootScope, $state) {
          // $scope.isLoggedIn = false;
          console.log($rootScope);
          $scope.logout = function(){
            mainSrvc.getLogout().then(function(){
              $state.go('home');
              $rootScope.currentUser = null;
            });
          }

          $rootScope.$watch('currentUser', function(newVal) {
            if(newVal) {
              $scope.isLoggedIn = true;
            } else {
              $scope.isLoggedIn = false;
            }
          });
        }
    }
});
