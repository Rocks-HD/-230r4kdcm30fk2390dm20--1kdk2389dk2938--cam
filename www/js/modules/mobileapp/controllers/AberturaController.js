'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:AberturaController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('AberturaController', ['$scope', '$timeout', 'ModelDeputados', function AberturaController($scope, $timeout, ModelDeputados) {


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
            var lstDeputados = ModelDeputados.listarDeputados(1);

            $.when(lstDeputados).then(function(r) {
                $timeout(function() {
                    window.location.hash = 'home';
                }, 1000);
            });
        });

    }]);
