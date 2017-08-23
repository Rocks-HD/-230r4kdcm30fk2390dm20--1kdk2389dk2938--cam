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
    .controller('CompararController', ['$scope', '$location', '$window', 'ModelDespesas', 'ModelDeputados', 'ModelProposicoes', function CompararController($scope, $location, $window, ModelDespesas, ModelDeputados, ModelProposicoes) {
        $scope.selfUrl = $location.url();
        
        
        $scope.labels1  = ['', ''];
        $scope.data1    = [0, 0];
        $scope.options1 = { title: { display: true, position: 'bottom'}, legend: { display: true } };
        
        $scope.preencherInfoCandidatos = function(info1, det1, prop1, data1, info2, det2, prop2, data2) 
        {
            console.log(det1);
            $(".imgCandidato1").attr('src', det1['0']['ultimoStatus']['urlFoto']);
            $(".nomeCandidato1").html(det1['0']['ultimoStatus']['nomeEleitoral']);
            $(".partidoCandidato1").html(det1['0']['ultimoStatus']['siglaPartido'] +'/'+det1['0']['ultimoStatus']['siglaUf']);
            $(".assiduidade1").html('');
            $(".mandatos1").html(typeof info1[0] ? info1.length : 1);
            $(".proposicoes1").html(prop1.length);
            $(".situacao1").html(typeof info1['situacaoNaLegislaturaAtual'] != 'undefined' ? info1['situacaoNaLegislaturaAtual'] : info1[0]['situacaoNaLegislaturaAtual']);
            $(".escolaridade1").html(det1[0]['escolaridade']);
            $(".qntComissoesTitular1").html('');
            $(".qntCargosOcupados1").html('');

            console.log(det2);
            $(".imgCandidato2").attr('src', det2['0']['ultimoStatus']['urlFoto']);
            $(".nomeCandidato2").html(det2['0']['ultimoStatus']['nomeEleitoral']);
            $(".partidoCandidato2").html(det2['0']['ultimoStatus']['siglaPartido'] +'/'+det1['0']['ultimoStatus']['siglaUf']);
            $(".assiduidade2").html('');
            $(".mandatos2").html(typeof info2[0] ? info1.length : 1);
            $(".proposicoes2").html(prop2.length);
            $(".situacao2").html(typeof info2['situacaoNaLegislaturaAtual'] != 'undefined' ? info2['situacaoNaLegislaturaAtual'] : info2[0]['situacaoNaLegislaturaAtual']);
            $(".escolaridade2").html(det2[0]['escolaridade']);
            $(".qntComissoesTitular2").html('');
            $(".qntCargosOcupados2").html('');

            $scope.preencherGrafico(info1, data1, info2, data2);
        };        
        
        
        $scope.preencherGrafico = function(info1, data1, info2, data2) 
        {
            for (var i in data1['GTA']) { $scope.data1[0] += parseFloat(data1['GTA'][i]); }
            for (var i in data2['GTA']) { $scope.data1[1] += parseFloat(data2['GTA'][i]); }
            
            $scope.labels1[0] = typeof info1[0] != 'undefined' ? info1[0]['nomeParlamentarAtual'] : info1['nomeParlamentarAtual'];
            $scope.labels1[1] = typeof info2[0] != 'undefined' ? info2[0]['nomeParlamentarAtual'] : info2['nomeParlamentarAtual'];            
            $scope.data1[0] = number_format($scope.data1[0], 2, '.', '');
            $scope.data1[1] = number_format($scope.data1[1], 2, '.', '');
        };

        

        
        
        /**
         * Garante que o chart será atualizado quando houver mudança de valores
         */
        $scope.$on('chart-update', function(evt, chart){
            chart.update();
        });          
        
        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            var arrDeputados    = strstr($scope.selfUrl, 'comparar/', false).replace('comparar/', '').split('-'),                
                infoDeputado1   = ModelDeputados.informacaoDoDeputadoV1(arrDeputados[0]),
                infoDeputado2   = ModelDeputados.informacaoDoDeputadoV1(arrDeputados[1]),
                infoDetalhada1  = ModelDeputados.informacaoDoDeputado(arrDeputados[0]),
                infoDetalhada2  = ModelDeputados.informacaoDoDeputado(arrDeputados[1]),
                proposicoes1    = ModelProposicoes.listarProposicoesCandidato(infoDetalhada1['0']['ultimoStatus']['nomeEleitoral']),
                proposicoes2    = ModelProposicoes.listarProposicoesCandidato(infoDetalhada2['0']['ultimoStatus']['nomeEleitoral']),
                despesasDep1    = ModelDespesas.gerarEstatistica(arrDeputados[0]),
                despesasDep2    = ModelDespesas.gerarEstatistica(arrDeputados[1]);
                
            $scope.data1    = [50, 50];    
                
            $.when(infoDeputado1, infoDeputado2, infoDetalhada1, infoDetalhada2, proposicoes1, proposicoes2, despesasDep1, despesasDep2).then(function(inf1, inf2, det1, det2, prop2, prop1, desp1, desp2) {
                $scope.preencherInfoCandidatos(inf1, det1, prop1, desp1, inf2, det2, prop2, desp2);
                
            });
        });     

    }]);