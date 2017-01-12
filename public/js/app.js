var login = {
   security: (mainService, $state) => {
     return mainService.getAuth()
       .catch((err) => {
         console.log(err);
         if(err.status === 401){
           $state.go("login");
         } else if (err.status === 403){
           $state.go("home");
         }
       })
   }
 }


angular.module('sustenance', ['myLoginCheck'], ['ui.router'])
    .config(function( $stateProvider, $urlRouterProvider){

        $stateProvider
            .state('home',{
                url:'/',
                templateUrl: "/views/home.html",
                controller: 'homeCtrl'
            })
            .state('login',{
                url:'/login',
                templateUrl: "/views/login.html",
                controller: 'loginCtrl'
            })
            .state('collections',{
                url:'/collections',
                templateUrl: '/views/collections.html',
                controller: 'collectionsCtrl',
                resolve: login
            })
            .state('details',{
                url:'/details/:collectionId',
                templateUrl: '/views/details.html',
                controller: 'detailsCtrl'
            })
            .state('profile',{
                url:'/profile',
                templateUrl: '/views/profile.html',
                controller: 'profileCtrl'
            });


        $urlRouterProvider
            .otherwise('/');

});
