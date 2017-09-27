'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:AberturaController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('FocoController', ['$scope', '$timeout', 'ModelDeputados', 'ModelGeral', function FocoController($scope, $timeout, ModelDeputados, ModelGeral) {
        $scope.lstEstados       = new Array();
        $scope.lstPartidos      = new Array();
        
        $scope.labelsEstado     = [];
        $scope.dataEstado       = [];
        $scope.optionsEstado    = { title: { display: false, position: 'bottom'}, legend: { display: true } };
        
        $scope.labelsPartido    = [];
        $scope.dataPartido      = [];
        $scope.optionsPartido   = { title: { display: false, position: 'bottom'}, legend: { display: true } };
        
        $scope.nuDeputados      = 0;

        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.graficoEstado = function() 
        {
            var lstEstados = ModelGeral.listarEstadosLocal();
            
            for (var i in lstEstados) {
                if (lstEstados[i] != '') {
                    $scope.labelsEstado.push(i);             
                    $scope.dataEstado.push(lstEstados[i]);
                    $scope.nuDeputados += lstEstados[i];
                }
            }
            $(".carregandoGraficoEstado").hide();
            $(".graficoEstado").show();
        };


        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.graficoPartidos = function() 
        {
            var lstPartidos = ModelGeral.listarPartidosLocal();
            
            for (var i in lstPartidos) {
                if (lstPartidos[i] != '') {
                    $scope.labelsPartido.push(i);             
                    $scope.dataPartido.push(lstPartidos[i]);             
                }
            }
            $(".carregandoGraficoPartido").hide();
            $(".graficoPartido").show();
        };


        /**
         * 
         * @returns {void}
         */
        $scope.preencherInfoBlocoPartidario = function() 
        {
            var lstPartidos = ModelGeral.listarPartidosLocal();
                lstBlocosPartidarios = ModelGeral.listar
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
            var lstDeputados = ModelDeputados.listarDeputados(1);

            $.when(lstDeputados).then(function(r) {
                $scope.graficoEstado();
                $scope.graficoPartidos();
            });
        });

    }]);
