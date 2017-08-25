'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('RankingController', ['$scope', '$location', '$timeout', 'ModelDeputados', 'ModelGeral', 'ModelProposicoes', function RankingController($scope, $location, $timeout, ModelDeputados, ModelGeral, ModelProposicoes) {
        $scope.selfUrl = $location.url();
        
        
        /**
         * 
         * @returns {undefined}
         */
        $scope.initLstRanking = function() 
        {
            var lstOpiniao = ModelProposicoes.listarOpinioes();               
            ModelProposicoes.timeoutObterVotacaoProposicaoPorId(lstOpiniao);
        
            if (lstOpiniao == null || lstOpiniao.length == 0) {
                $(".areaRanking").html('<div class="margin-top-15">Você ainda não deu sua opnião em nenhuma proposição!</div>');
            } else {
                $scope.listarRanking();
            }
        };
        
        /**
         * 
         * @returns {undefined}
         */
        $scope.listarRanking = function() 
        {
            if ($(".ajaxCarregando").length == 0) {
                var lstOpiniao = ModelProposicoes.listarOpinioes();
                var lstRanking = JSON.parse(localStorage.getItem('ranking'));;
                var ttDeputado = {};
                
                for (var i in lstRanking) {
                    for (var u in lstRanking[i]['votos']['Deputado']) {
                        var proposicoes = lstRanking[i]['votos']['Deputado'][u];

                        if ((proposicoes['$']['voto'] == 'Sim' && lstOpiniao[u]['tpVoto'] == 'favor') || (proposicoes['$']['voto'] == 'Não' && lstOpiniao[u]['tpVoto'] == 'contra')) {
                            if (typeof ttDeputado[proposicoes['ideCadastro']] != 'undefined') {
                                ttDeputado[proposicoes['ideCadastro']] = ttDeputado[proposicoes['ideCadastro']]+1;
                            } else {
                                ttDeputado[proposicoes['ideCadastro']] = 1;
                            }
                        }
                    }
                }

                var html = '<div class="row linha-zebrada text-center padding-vertical" data-id="">'+
                                '<div class="col-xs-4 texto-grande"><h3>1º</h3></div>'+
                                '<div class="col-xs-4 texto-maiusculo">'+
                                '<img src="./js/modules/mobileapp/layouts/imagens/fotos/01.jpg" alt="Juarez Dantas" class="borda-roxa-clara img-100"/>'
                                '<br>'+
                                '<p><strong>Carregando</strong><br>--/--</p>'+
                                '<img src="./js/modules/mobileapp/layouts/imagens/icones/ico-mao-clique.svg" alt="clique e saiba mais" class="posicionamento-mao" />'+
                            '</div>'+
                            '<div class="col-xs-4 texto-grande texto-roxo"><h3>10</h3></div>'+
                        '</div>';
            } else {
                $timeout(function() {
                    $scope.listarRanking();
                }, 1000);
            }
        };
        
        
        
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
            $scope.initLstRanking();
        });     

    }]);