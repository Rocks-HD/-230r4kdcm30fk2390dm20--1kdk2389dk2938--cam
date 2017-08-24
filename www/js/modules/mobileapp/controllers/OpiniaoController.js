'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('OpiniaoController', ['$scope', '$location', '$window', 'ModelDespesas', 'ModelDeputados', function OpiniaoController($scope, $location, $window, ModelDespesas, ModelDeputados) {
        $scope.selfUrl = $location.url();
        
        
        /**
         * Garantir uma nova model
         * @returns {undefined}
         */
        window.onhashchange = function() {
            window.location.reload();
        };        
        
        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
                
            console.log('aqui');
            
        });     

    }]);