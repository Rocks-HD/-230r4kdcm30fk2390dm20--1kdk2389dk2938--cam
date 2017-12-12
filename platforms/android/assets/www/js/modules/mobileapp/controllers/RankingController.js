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
        $scope.selfUrl      = $location.url();
        $scope.lstDeputados = ModelDeputados.listarDeputadosLocal();
        $scope.lstOpiniao   = new Array();
        $scope.ranking      = {};
        $scope.contador     = 0;
        
        /**
         * 
         * @returns {undefined}
         */
        $scope.initLstRanking = function() 
        {
            $scope.lstOpiniao = ModelProposicoes.listarOpinioes();
        
            if ($scope.lstOpiniao == null || $scope.lstOpiniao.length == 0) {
                $(".areaRanking").html('<div class="margin-top-15">Você ainda não deu sua opinião em nenhuma proposição!</div>');
            } else {
                $scope.ranking = {};
                $scope.listarRanking(0);
            }
        };
        
        /**
         * 
         * @returns {undefined}
         */
        $scope.listarRanking = function(idopiniao)
        {
            var infoProposicao  = ModelProposicoes.obterVotacaoProposicaoPorId($scope.lstOpiniao[idopiniao]['coProposicao']);
            $(".contentCarregando").show();
            $('.areaRanking').html('');
            
            $.when(infoProposicao).then(function(prop1) {
                var lstVotacoes = prop1 instanceof XMLDocument ? $.xml2json(prop1)['#document']['proposicao']['Votacoes']['Votacao'] : prop1;
                
                for (var i in lstVotacoes) {
                    var contador = 0;
                    if (typeof lstVotacoes[i]['votos'] != 'undefined') {
                        var deputado = lstVotacoes[i]['votos']['Deputado'];
                        for (var v in deputado) {
                            if ((deputado[v]['$']['Voto'] == 'Não            ' && $scope.lstOpiniao[idopiniao]['tpVoto'] == 'contra') || (deputado[v]['$']['Voto'] == 'Sim            ' && $scope.lstOpiniao[idopiniao]['tpVoto'] == 'favor')) {
                                $scope.ranking[deputado[v]['$']['ideCadastro']] = parseInt(typeof $scope.ranking[deputado[v]['$']['ideCadastro']] != 'undefined' ? $scope.ranking[deputado[v]['$']['ideCadastro']] : 0) + 1;
//                                if (++contador >= 5) {break;}
                            }
                        }   
                    }
                }
                
//                $scope.contador = idopiniao;
                if (typeof $scope.lstOpiniao[parseInt(idopiniao)+1] != 'undefined') {
                    $scope.listarRanking(parseInt(idopiniao)+1);
                } else {
                    var posicao = 0;
                    var estado  = $("#ds_estado").val();
                    var partido = $("#ds_partido").val();
                    let keys    = Object.keys($scope.ranking);
                    keys.sort(function(a, b) { return $scope.ranking[a] - $scope.ranking[b] });
                    
                    for (var i in keys.reverse()) {
                        for (var d in $scope.lstDeputados) {
                            if ($scope.lstDeputados[d]['id'] == keys[i] && (estado == '' || estado == $scope.lstDeputados[d]['siglaUf']) && (partido == '' || partido == $scope.lstDeputados[d]['siglaPartido'])) {
                                var html = '<div class="row linha-zebrada text-center padding-vertical" data-id="">'+
                                                '<div class="col-xs-4 texto-grande">'+
                                                    '<h3>'+ ++posicao +'º</h3>'+
                                                '</div>'+
                                                '<div class="col-xs-4 texto-maiusculo">'+
                                                    '<a href="#/conheca/'+ keys[i] +'"><img src="'+ $scope.lstDeputados[d]['urlFoto'] +'" alt="'+ $scope.lstDeputados[d]['nome'] +'" class="borda-roxa-clara img-100"/></a>'+
                                                    '<br>'+
                                                    '<p><strong>'+ $scope.lstDeputados[d]['nome'] +'</strong>'+
                                                    '<br>'+ $scope.lstDeputados[d]['siglaUf'] +'/'+ $scope.lstDeputados[d]['siglaPartido'] +'</p>'+
                                                    '<img src="./js/modules/mobileapp/layouts/imagens/icones/ico-mao-clique.svg" alt="clique e saiba mais" class="posicionamento-mao" />'+
                                            '</div>'+
                                            '<div class="col-xs-4 texto-grande texto-roxo">'+
                                                '<h3>'+ $scope.ranking[keys[i]] +'</h3>'+
                                            '</div>'+
                                        '</div>';
                                $('.areaRanking').append(html);
                                break;
                            }
                        }
                        if (i == 14) {
                            break;
                        }
                    }
                    
                    if ($('.areaRanking').html() == '') {
                        $('.areaRanking').html('<div class="text-center margin-top-10"><h3>Nenhum deputado encontrado com o filtro informado</h3></div>');
                    }
                    
                    $(".contentCarregando").hide();
                }
            });
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
         * ON: verifica se o usuário esta digitando alguma palavra
         */
        $(document).on("change", "#ds_estado, #ds_partido", function() {
            $scope.initLstRanking();
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
            $scope.listarEstados();
            $scope.listarPartidos();
            $scope.initLstRanking();
        });     

    }]);