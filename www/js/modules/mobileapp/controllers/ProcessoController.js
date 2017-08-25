'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:AberturaController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('ProcessoController', ['$scope', '$timeout', 'ModelDeputados', function ProcessoController($scope, $timeout, ModelDeputados) {


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

        });

    }]);
