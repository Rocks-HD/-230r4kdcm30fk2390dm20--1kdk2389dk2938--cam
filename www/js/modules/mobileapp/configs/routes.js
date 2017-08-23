'use strict';
/**
 * @ngdoc overview
 * @name angularHelloApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('camara')


// configure views; whenAuthenticated adds a resolve method to ensure users authenticate
// before trying to access that route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/home.html',
            controller: 'HomeController'
        }).when('/opiniao', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/opiniao.html',
            controller: 'OpniaoController'
        }).when('/ranking', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/ranking.html',
            controller: 'HomeController'
        }).when('/conheca/:item', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/conheca.html',
            controller: 'DeputadoController'
        }).when('/comparar/:item', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/comparar.html',
            controller: 'CompararController'
        }).when('/abertura', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/abertura.html',
            controller: 'HomeController'
        }).when('/carregando', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/carregando.html',
            controller: 'HomeController'
        }).when('/creditos', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/creditos.html',
            controller: 'HomeController'
        })
        //.otherwise({redirectTo: '/'});
        ;
}]);
