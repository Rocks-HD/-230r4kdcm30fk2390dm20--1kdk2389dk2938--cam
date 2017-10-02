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
            var listarBlocos = ModelGeral.listarBlocoPartidario();
            var html        = '';
            var contador    = 0;
            var giro        = 0;
            
            if (typeof listarBlocos != 'undefined') {
                for (var i in listarBlocos) {
                    html += '<div class="col-xs-6 text-center btnBlocosPartidarios fundo-cinza-'+ ((++contador%2 == 0) ? (giro%2 != 0 ? 'claro' : 'escuro') : (giro%2 != 0 ? 'escuro' : 'claro')) +' padding-vertical" data-id="'+ i +'"><h3>'+ i +'</h3>'+ listarBlocos[i] +' deputados</div>';
                    $(".lstBlocosPartidarios").html(html);
                    if (contador%2 == 0) {++giro;}
                }
            } else {
                $scope.timeoutPreencherInfoBlocoPartidario();
            }
        };
        
        
        /**
         * return {void}
         */
        $scope.timeoutPreencherInfoBlocoPartidario = function()
        {
            $timeout(function() {
                $scope.preencherInfoBlocoPartidario();
            }, 10000);
        };


        //
        $(document).on('click', '.btnBlocosPartidarios', function() {
            var coBloco     = $(this).attr('data-id'),
                infoBloco   = ModelGeral.infoBlocoPartidario(coBloco),
                html        =   '<div><strong>Nome do Bloco:</strong> '+ infoBloco['nomeBloco'] +'</div>'+
                                '<div><strong>Sigla:</strong> '+ infoBloco['siglaBloco'] +'</div>'+
                                '<div><strong>Data de Criaçao:</strong> '+ infoBloco['dataCriacaoBloco'] +'</div>'+
                                '<div><strong>Data de Extinção: <span class="text-danger">'+ infoBloco['dataExtincaoBloco'] +'</span></strong></div><hr />';
                        
                for (var i in infoBloco['Partidos']['partido']) {
                    html += '<ul>';
                    html += '<li class="margin-left-10"><strong>Nome do Partido:</strong> <span class="text-info">'+ infoBloco['Partidos']['partido'][i]['nomePartido'] +'</span></li>';
                    html += '<li class="margin-left-10"><strong>Sigla do Partido:</strong> '+ infoBloco['Partidos']['partido'][i]['siglaPartido'] +'</li>';
                    html += '<li class="margin-left-10"><strong>Adesão ao bloco:</strong> '+ infoBloco['Partidos']['partido'][i]['dataAdesaoPartido'] +'</li>';
                    html += '<li class="margin-left-10"><strong>Desligamento:  <span class="text-danger"> '+ infoBloco['Partidos']['partido'][i]['dataDesligamentoPartido'] +'</span></strong></li>';
                    html += '</ul><hr />';
                }
                
            $("#systemModal .modal-body").html(html);
            $("#systemModal").modal();
        });

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
                $scope.preencherInfoBlocoPartidario();
            });
        });

    }]);
