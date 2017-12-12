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


        $scope.inicializacao = function() 
        {
            try {
                //localStorage.clear();
                var lstDeputados = ModelDeputados.listarDeputados(1);
                $(".glyphicon-menu-hamburger").parent().hide();

                $.when(lstDeputados).then(function(r) {
                    $timeout(function() {
                        $(".glyphicon-menu-hamburger").parent().show();
                        window.location.hash = 'home';
                    }, 5000);
                });                        
            } catch (e) {console.log(e);}
        };

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
            $scope.inicializacao();
        });

    }]);
