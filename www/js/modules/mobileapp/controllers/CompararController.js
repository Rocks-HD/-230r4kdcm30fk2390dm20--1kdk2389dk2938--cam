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
            var info1 = ModelDeputados.informacaoDoDeputado(coDeputado1);
            var info2 = ModelDeputados.informacaoDoDeputado(coDeputado2);
            
            if (typeof info1['0'] != 'undefined' && typeof info1['0']['ultimoStatus'] != 'undefined' && typeof info2['0'] != 'undefined' && typeof info2['0']['ultimoStatus'] != 'undefined') {
                $scope.InfoDeputado1        = info1;
                $scope.InfoDeputado2['0']   = typeof info2[1] != 'undefined' ? info2[1] : info2[0];

    //            console.log($scope.InfoDeputado1);
                $(".imgCandidato1").attr('src', $scope.InfoDeputado1['0']['ultimoStatus']['urlFoto']);
                $(".nomeCandidato1").html($scope.InfoDeputado1['0']['ultimoStatus']['nomeEleitoral']);
                $(".partidoCandidato1").html($scope.InfoDeputado1['0']['ultimoStatus']['siglaPartido'] +'/'+$scope.InfoDeputado1['0']['ultimoStatus']['siglaUf']);
                $(".escolaridade1").html($scope.InfoDeputado1['0']['escolaridade'] != null ? $scope.InfoDeputado1['0']['escolaridade'] : '---');
                $scope.labels1[0] = $scope.InfoDeputado1['0']['ultimoStatus']['nomeEleitoral'];


    //            console.log($scope.InfoDeputado2);
                $(".imgCandidato2").attr('src', $scope.InfoDeputado2['0']['ultimoStatus']['urlFoto']);
                $(".nomeCandidato2").html($scope.InfoDeputado2['0']['ultimoStatus']['nomeEleitoral']);
                $(".partidoCandidato2").html($scope.InfoDeputado2['0']['ultimoStatus']['siglaPartido'] +'/'+$scope.InfoDeputado2['0']['ultimoStatus']['siglaUf']);
                $(".escolaridade2").html($scope.InfoDeputado2['0']['escolaridade'] != null ? $scope.InfoDeputado2['0']['escolaridade'] : '---');
                $scope.labels1[1] = $scope.InfoDeputado2['0']['ultimoStatus']['nomeEleitoral'];
                $scope.data1    = [50, 50]; 
            } else {
                $timeout(function() {
                    $scope.preencherCabecalhoDeputado(coDeputado1, coDeputado2);
                }, 1000);
            }
        };
        
        /**
         * 
         * @param {type} data1
         * @param {type} data2
         * @returns {undefined}
         */
        $scope.preencherGrafico = function(coDeputado1, coDeputado2) 
        {   
            var despesasDep1    = ModelDespesas.gerarEstatistica(coDeputado1);
            
            $.when(despesasDep1).then(function(data1) {
                var despesasDep2    = ModelDespesas.gerarEstatistica(coDeputado2);
                
                for (var i in data1['GTA']) { $scope.data1[0] += parseFloat(data1['GTA'][i]); }
                $scope.data1[0] = number_format($scope.data1[0], 2, '.', '');
                
                $.when(despesasDep2).then(function(data2) {
                    for (var i in data2['GTA']) { $scope.data1[1] += parseFloat(data2['GTA'][i]); }
                    $scope.data1[1] = number_format($scope.data1[1], 2, '.', '');
                });
            });
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
                
            $.when(infoDeputado1, infoDeputado2).then(function(info1, info2) {
                $scope.InfoDeputado1V1 = typeof info1[0] != 'undefined' ? info1[ info1.length-1 ] : info1;
                $scope.InfoDeputado2V1 = typeof info2[0] != 'undefined' ? info2[ info2.length-1 ] : info2;                
                
//                console.log('cand1');
//                console.log($scope.InfoDeputado1V1);
//                console.log('cand2');
//                console.log($scope.InfoDeputado2V1);
                
                $(".assiduidade1").html('');
                $(".mandatos1").html(typeof info1[0] != 'undefined' ? info1.length : 1);
                $(".situacao1").html(typeof info1['situacaoNaLegislaturaAtual'] != 'undefined' ? info1['situacaoNaLegislaturaAtual'] : info1[0]['situacaoNaLegislaturaAtual']);
                $(".qntComissoesTitular1").html(typeof $scope.InfoDeputado1V1['comissoes']['comissao'] != 'undefined' ? $scope.InfoDeputado1V1['comissoes']['comissao'].length : '--');
                $(".qntCargosOcupados1").html(typeof $scope.InfoDeputado1V1['cargosComissoes']['cargoComissoes'] != 'undefined' ? $scope.InfoDeputado1V1['cargosComissoes']['cargoComissoes'].length : '--');
                    
                $(".assiduidade2").html('');
                $(".mandatos2").html(typeof info2[0] != 'undefined' ? info2.length : 1);
                $(".situacao2").html(typeof info2['situacaoNaLegislaturaAtual'] != 'undefined' ? info2['situacaoNaLegislaturaAtual'] : info2[0]['situacaoNaLegislaturaAtual']);
                $(".qntComissoesTitular2").html(typeof $scope.InfoDeputado2V1['comissoes']['comissao'] != 'undefined' ? $scope.InfoDeputado2V1['comissoes']['comissao'].length : '--');
                $(".qntCargosOcupados2").html(typeof $scope.InfoDeputado2V1['cargosComissoes']['cargoComissoes'] != 'undefined' ? $scope.InfoDeputado2V1['cargosComissoes']['cargoComissoes'].length : '--');

                if (typeof $scope.InfoDeputado1['0'] != 'undefined' && typeof $scope.InfoDeputado1['0']['ultimoStatus'] != 'undefined' && typeof $scope.InfoDeputado2['0'] != 'undefined' && typeof $scope.InfoDeputado2['0']['ultimoStatus'] != 'undefined') {
                    $scope.exibirProposicoes(coDeputado1, coDeputado2);
                } else {
                    $timeout(function() {
                        $scope.exibirProposicoes(coDeputado1, coDeputado2);
                    }, 2000);
                }
            })
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

    //                    console.log(prop1);
                    $(".proposicoes1").html(propCand1.length);
    //                    console.log(prop2);
                    $(".proposicoes2").html(propCand2.length);
                });    
            } catch (e) {window.location.reload();}

            

        }
        
        
        /**
         * Garante que o chart será atualizado quando houver mudança de valores
         */
        $scope.$on('chart-update', function(evt, chart){
            chart.update();
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