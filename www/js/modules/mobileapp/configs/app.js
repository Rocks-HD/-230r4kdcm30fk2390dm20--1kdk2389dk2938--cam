'use strict';

/**
 * @ngdoc overview
 * @name angularHelloApp
 * @description
 * # angularHelloApp
 *
 * Main module of the application.
 */
angular.module('camara', [
    'ngResource',
    'ngRoute',
    'ngSanitize'
]).config(function ($compileProvider, $sceDelegateProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://*.webfans.com.br/**',
        'http://webfans.com.br/**',
        'http://host.camaraapp/**']);
});