'use strict';

/**
 * 73441 - russomanno
 * 178864 - Adail Carneiro
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('CompararController', ['$scope', '$location', '$timeout', 'ModelDespesas', 'ModelDeputados', 'ModelProposicoes', function CompararController($scope, $location, $timeout, ModelDespesas, ModelDeputados, ModelProposicoes) {
        $scope.selfUrl       = $location.url();
        $scope.InfoDeputado1    = {};
        $scope.InfoDeputado2    = {};
        $scope.InfoDeputado1V1  = {};
        $scope.InfoDeputado2V1  = {};
        $scope.DepDespesas1     = {};
        $scope.DepDespesas2     = {};
        $scope.DepProposicoes1  = {};
        $scope.DepProposicoes2  = {};
        $scope.contador         = 0;
        
        $scope.labels1  = ['', ''];
        $scope.data1    = [0, 0];
        $scope.options1 = { title: { display: true, position: 'bottom'}, legend: { display: true } };
        
        
        /**
         * Preenche as primeiras informações do deputado
         * @param {int} coDeputado1
         * @param {int} coDeputado2
         * @returns {void}
         */
        $scope.preencherCabecalhoDeputado = function(coDeputado1, coDeputado2) 
        {
            var infoDeputado1 = ModelDeputados.informacaoDoDeputado(coDeputado1);

            $.when(infoDeputado1).then(function(info1) {
                try {
                    $scope.InfoDeputado1 = typeof info1['dados'] != 'undefined' ? info1['dados'] : info1;
                    $(".imgCandidato1").attr('src', $scope.InfoDeputado1['0']['ultimoStatus']['urlFoto']);
                    $(".nomeCandidato1").html($scope.InfoDeputado1['0']['ultimoStatus']['nomeEleitoral']);
                    $(".partidoCandidato1").html($scope.InfoDeputado1['0']['ultimoStatus']['siglaPartido'] +'/'+$scope.InfoDeputado1['0']['ultimoStatus']['siglaUf']);
                    $(".escolaridade1").html($scope.InfoDeputado1['0']['escolaridade'] != null ? $scope.InfoDeputado1['0']['escolaridade'] : '---');
                    $(".areaDep1").attr('data-id', $scope.InfoDeputado1['0']['id']);
                    $scope.labels1[0] = $scope.InfoDeputado1['0']['ultimoStatus']['nomeEleitoral'];

                    var infoDeputado2 = ModelDeputados.informacaoDoDeputado(coDeputado2);
                    $.when(infoDeputado2).then(function(info2) {
                        try {
                            $scope.InfoDeputado2   = typeof info2['dados'] != 'undefined' ? info2['dados'] : (typeof info2[0] != 'undefined' ? [info2[0]] : [info2]);
                            $(".imgCandidato2").attr('src', $scope.InfoDeputado2['0']['ultimoStatus']['urlFoto']);
                            $(".nomeCandidato2").html($scope.InfoDeputado2['0']['ultimoStatus']['nomeEleitoral']);
                            $(".partidoCandidato2").html($scope.InfoDeputado2['0']['ultimoStatus']['siglaPartido'] +'/'+$scope.InfoDeputado2['0']['ultimoStatus']['siglaUf']);
                            $(".escolaridade2").html($scope.InfoDeputado2['0']['escolaridade'] != null ? $scope.InfoDeputado2['0']['escolaridade'] : '---');
                            $(".areaDep2").attr('data-id', $scope.InfoDeputado2['0']['id']);
                            $scope.labels1[1] = $scope.InfoDeputado2['0']['ultimoStatus']['nomeEleitoral'];
                                    
                        } catch (e) {
                            $scope.timeOutPreencherCabecalhoDeputado(coDeputado1, coDeputado2);     
                        }
                    });
                            
                } catch (e) {
                    $scope.timeOutPreencherCabecalhoDeputado(coDeputado1, coDeputado2);
                }
            });
        };
        
        
        /**
         * Forçando a barra até conseguir as informações do deputado
         * @param {type} coDeputado1
         * @param {type} coDeputado2
         * @returns {undefined}
         */
        $scope.timeOutPreencherCabecalhoDeputado = function(coDeputado1, coDeputado2) 
        {
            if ($(".ajaxCarregando").length == 0) {
                $timeout(function() {
                    $scope.preencherCabecalhoDeputado(coDeputado1, coDeputado2);
                }, 1000);
            } else {
                $timeout(function() {
                    $scope.timeOutPreencherCabecalhoDeputado(coDeputado1, coDeputado2);
                }, 1000);
            }
        };
        
        
        /**
         * 
         * @param {int} coDeputado1
         * @param {int} coDeputado2
         * @returns {void}
         */
        $scope.preencherGrafico = function(coDeputado1, coDeputado2) 
        {
            var despesasDep1    = ModelDespesas.gerarEstatistica(coDeputado1);

            if ($(".ajaxCarregando").length == 0) {
                $.when(despesasDep1).then(function(data1) {
                    if (typeof data1['DGM']['undefined'] == 'undefined') {
                        var despesasDep2    = ModelDespesas.gerarEstatistica(coDeputado2);

                        $.when(despesasDep2).then(function(data2) {
                            if (typeof data2['DGM']['undefined'] == 'undefined') {
                                for (var i in data1['GTA']) { $scope.data1[0] += parseFloat(data1['GTA'][i]); }
                                $scope.data1[0] = number_format($scope.data1[0], 2, '.', '');

                                for (var i in data2['GTA']) { $scope.data1[1] += parseFloat(data2['GTA'][i]); }
                                $scope.data1[1] = number_format($scope.data1[1], 2, '.', '');

                                $(".carregandoGrafico1").hide();
                                $(".grafico1").show();

                            } else {
                                $scope.timeOutPreencherGrafico(coDeputado1, coDeputado2);
                            }
                        });
                    } else {
                        $scope.timeOutPreencherGrafico(coDeputado1, coDeputado2);
                    }
                });
            } else {
                $scope.timeOutPreencherGrafico(coDeputado1, coDeputado2);
            }
        };        
        
        
        /**
         * 
         * @param {int} coDeputado1
         * @param {int} coDeputado2
         * @returns {void}
         */
        $scope.timeOutPreencherGrafico = function(coDeputado1, coDeputado2) 
        {
            $timeout(function() {
                $scope.preencherGrafico(coDeputado1, coDeputado2);
            }, 5000);
        };
        
        
        /**
         * Preenche as primeiras informações do deputado
         * @param {int} coDeputado1
         * @param {int} coDeputado2
         * @returns {void}
         */
        $scope.preencherInfoCandidatos = function(coDeputado1, coDeputado2) 
        {
            var infoDeputado1   = ModelDeputados.informacaoDoDeputadoV1(coDeputado1);
            var infoDeputado2   = ModelDeputados.informacaoDoDeputadoV1(coDeputado2);
                
            $.when(infoDeputado1, infoDeputado2).then(function(info1V1, info2V1) {
                try {
                    $scope.InfoDeputado1V1 = info1V1 instanceof XMLDocument ? $.xml2json(info1V1)['Deputados']['Deputado'] : info1V1;
                    $scope.InfoDeputado2V1 = info2V1 instanceof XMLDocument ? $.xml2json(info2V1)['Deputados']['Deputado'] : info2V1;                

                    var legisAtual1 = typeof info1V1[0] != 'undefined' ? info1V1[0] : info1V1;
                    var legisAtual2 = typeof info2V1[0] != 'undefined' ? info2V1[0] : info2V1;
                    
                    $(".assiduidade1").html('');
                    $(".mandatos1").html(typeof info1V1[0] != 'undefined' ? info1V1.length : 1);
                    $(".situacao1").html(legisAtual1['situacaoNaLegislaturaAtual']);
                    $(".qntComissoesTitular1").html(typeof legisAtual1['comissoes']['comissao'] != 'undefined' ? legisAtual1['comissoes']['comissao'].length : '--');
                    $(".qntCargosOcupados1").html(typeof legisAtual1['cargosComissoes']['cargoComissoes'] != 'undefined' ? legisAtual1['cargosComissoes']['cargoComissoes'].length : '--');

                    $(".assiduidade2").html('');
                    $(".mandatos2").html(typeof info2V1[0] != 'undefined' ? info2V1.length : 1);
                    $(".situacao2").html(legisAtual2['situacaoNaLegislaturaAtual']);
                    $(".qntComissoesTitular2").html(typeof legisAtual2['comissoes']['comissao'] != 'undefined' ? legisAtual2['comissoes']['comissao'].length : '--');
                    $(".qntCargosOcupados2").html(typeof legisAtual2['cargosComissoes']['cargoComissoes'] != 'undefined' ? legisAtual2['cargosComissoes']['cargoComissoes'].length : '--');

                    if (typeof $scope.InfoDeputado1['0'] != 'undefined' && typeof $scope.InfoDeputado1['0']['ultimoStatus'] != 'undefined' && 
                        typeof $scope.InfoDeputado2['0'] != 'undefined' && typeof $scope.InfoDeputado2['0']['ultimoStatus'] != 'undefined') {
                        $scope.exibirProposicoes(coDeputado1, coDeputado2);
                    } else {
                        $scope.timeOutPreencherInfoCandidatos(coDeputado1, coDeputado2);
                    }    
                } catch (e) {

                }
            });
        };        
        
        
        /**
         * Forçando a barra até conseguir as informações do deputado
         * 
         * @param {type} coDeputado1
         * @param {type} coDeputado2
         * @returns {undefined}
         */
        $scope.timeOutPreencherInfoCandidatos = function(coDeputado1, coDeputado2) 
        {
            if ($(".ajaxCarregando").length == 0) {
                $timeout(function() {
                    $scope.preencherInfoCandidatos(coDeputado1, coDeputado2);
                }, 1000);
            } else {
                $timeout(function() {
                    $scope.timeOutPreencherInfoCandidatos(coDeputado1, coDeputado2);
                }, 1000);
            }
        };
        
        
        /**
         * Lista as proposições de cada deputado
         * 
         * @param {type} coDeputado1
         * @param {type} coDeputado2
         * @returns {undefined}
         */
        $scope.exibirProposicoes = function(coDeputado1, coDeputado2) {
            try {
                var proposicoes1    = ModelProposicoes.listarProposicoesCandidato(coDeputado1, $scope.InfoDeputado1['0']['ultimoStatus']['nomeEleitoral']),
                    proposicoes2    = ModelProposicoes.listarProposicoesCandidato(coDeputado2, $scope.InfoDeputado2['0']['ultimoStatus']['nomeEleitoral']);


                $.when(proposicoes1, proposicoes2).then(function(prop1, prop2) {
                    var propCand1 = prop1 instanceof XMLDocument ? $.xml2json(prop1)['#document']['proposicoes']['proposicao'] : prop1;
                    var propCand2 = prop2 instanceof XMLDocument ? $.xml2json(prop2)['#document']['proposicoes']['proposicao'] : prop2;

                    $(".proposicoes1").html(propCand1.length);
                    $(".proposicoes2").html(propCand2.length);
                });    
            } catch (e) {window.location.reload();}
        };
        
        
        /**
         * Garante que o chart será atualizado quando houver mudança de valores
         */
        $scope.$on('chart-update', function(evt, chart){
            chart.update();
        });          
        
        
        $(document).on("click", ".areaDep1, .areaDep2", function() {
            window.location.hash = '/conheca/'+ $(this).attr('data-id');
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
            var arrDeputados    = strstr($scope.selfUrl, 'comparar/', false).replace('comparar/', '').split('-');
            
            $scope.preencherCabecalhoDeputado(arrDeputados[0], arrDeputados[1]);
            $scope.preencherInfoCandidatos(arrDeputados[0], arrDeputados[1]);
            $scope.preencherGrafico(arrDeputados[0], arrDeputados[1]);
        });     

    }]);