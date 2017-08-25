'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('RankingController', ['$scope', '$location', '$window', 'ModelDeputados', 'ModelGeral', 'ModelProposicoes', function RankingController($scope, $location, $window, ModelDeputados, ModelGeral, ModelProposicoes) {
        $scope.selfUrl = $location.url();
        
        
        
        
        
        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.listarEstados = function() 
        {
            var lstEstados = ModelGeral.listarEstadosLocal();
            
            for (var i in lstEstados) {
                $("#ds_estado").append('<option value="'+ i +'">'+ i +'</option>');
            }
        };


        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.listarPartidos = function() 
        {
            var lstPartidos = ModelDeputados.listarPartidos();
            
            for (var i in lstPartidos) {
                $("#ds_partido").append('<option value="'+ i +'">'+ i +'</option>');
            }
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
            $scope.listarEstados();
            $scope.listarPartidos();

            console.log('aqui');
            
        });     

    }]);