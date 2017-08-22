'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('OpniaoController', ['$scope', '$location', '$window', 'ModelDespesas', 'ModelDeputados', function($scope, $location, $window, ModelDespesas, ModelDeputados) {
        $scope.selfUrl = $location.url();
        
        
        /**
         * INIT: 
         */
        angular.element(document).ready(function() {

                
            console.log('aqui');
            
        });     

    }]);