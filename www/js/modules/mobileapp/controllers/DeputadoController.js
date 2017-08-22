'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('DeputadoController', ['$scope', '$location', '$window', 'ModelDespesas', 'ModelDeputados', function($scope, $location, $window, ModelDespesas, ModelDeputados) {
        $scope.selfUrl = $location.url();
        $scope.labels1 = [];
        $scope.data1 = [];
        $scope.options1 = { title: { display: true, position: 'bottom'}, legend: { display: true } };
        
        $scope.labels2 = [];
        $scope.data2 = [];
        $scope.barChartOptions2 = {
            showToolTips: true,
            tooltipEvents: ["mousemove", "touchstart", "touchmove"],
        };


        /**
         * Preenche a tela com informações vindas do servidor
         * 
         * @param {object} infoDeputado
         * @returns {void}
         */
        $scope.preencherInfoDeputado = function(infoDeputado) 
        {
            try {
                $(".nomeDestaque").append(infoDeputado[0]['ultimoStatus']['nomeEleitoral']+' ('+infoDeputado[0]['ultimoStatus']['siglaPartido'] +'-'+infoDeputado[0]['ultimoStatus']['siglaUf']+')' );
                $(".infoNome").append(infoDeputado[0]['nomeCivil']);
                $(".infoNomeEleitoral").append(infoDeputado[0]['ultimoStatus']['nomeEleitoral']);
                $(".infoPartido").append(infoDeputado[0]['ultimoStatus']['siglaPartido'] +'-'+infoDeputado[0]['ultimoStatus']['siglaUf']);
                $(".foto-conheca-seu-deputado").attr('src', infoDeputado[0]['ultimoStatus']['urlFoto']);
                $(".infoNascimento").append(infoDeputado[0]['dataNascimento'].split('-').reverse().join('/'));
                $(".infoTelefone").append(infoDeputado[0]['ultimoStatus']['gabinete']['telefone']);
                $(".infoEmail").append(infoDeputado[0]['ultimoStatus']['gabinete']['email']);
                $(".infoEscolaridade").append(infoDeputado[0]['escolaridade']);
                
            } catch (e) {console.log(e);}
        };


        /**
         * 
         * @param {object} lstComissoes
         * @returns {void}
         */
        $scope.layoutComissoes = function(lstComissoes) 
        {
            var html = '';
            for (var i in lstComissoes) {
                if (typeof lstComissoes[i]['idOrgao'] != 'undefined') {
                    html = '<p>'+ 
                                lstComissoes[i]['nomePapel'] +' - '+ lstComissoes[i]['nomeOrgao'] +'<br />'+
                                lstComissoes[i]['dataInicio'].split('-').reverse().join('/') + (lstComissoes[i]['dataFim'] ? ' - '+ lstComissoes[i]['dataFim'].split('-').reverse().join('/') : '') +
                           '</p><br />'
                   
                    if (lstComissoes[i]['nomePapel'] == 'Titular') {
                        $(".lstTitularComissoes").append(html);
                    } else {
                        $(".lstSuplenteComissoes").append(html);
                    }
                }
            }
        }
        
        
        /**
         * PF;PJ que mais recebeu pagamento do deputado
         * 
         * @param {array} data
         * @returns {void}
         */
        $scope.layoutBeneficiarios = function(data) 
        {
            var nomesBeneficiarios  = data['NCNPJ'];
            var maiorBeneficiario   = data['MB'];
            var maiorBenefOrd       = Object.values(maiorBeneficiario).sort(function(a,b) { return a - b;}).reverse();
            var contador            = 0;
            var somatorio           = 0;
            
            for (var i in maiorBenefOrd) {
                if (contador++ <= 10) {
                    var key  = $.inArray(maiorBenefOrd[i], Object.values(maiorBeneficiario)),
                        cnpj = Object.keys(maiorBeneficiario)[key];
                
                    $(".maioresBeneficiarios").append('<p>'+
                                                        nomesBeneficiarios[ cnpj ] +'<br />'+
                                                        'R$ '+ number_format(maiorBenefOrd[i], 2, ',', '.')+
                                                      '</p><br />');
                }
                somatorio += maiorBenefOrd[i];
            }
            
            $(".valorTotal").append('TOTAL R$ '+ number_format(somatorio, 2, ',', '.'));
        }


        /**
         * 
         * @returns {undefined}
         */
        $scope.infoRelatorioDespesas = function () 
        {
            var coDeputado    = strstr($scope.selfUrl, '/', false).replace( /^\D+/g, ''),
                infoRelatorio = ModelDespesas.gerarEstatistica(coDeputado);
             
            for (var i in infoRelatorio['DGM']) {
               $scope.labels1.push(i);
               $scope.data1.push(number_format(infoRelatorio['DGM'][i], 2, '.', ''));
            }
            
            for (var i in infoRelatorio['VGM']) {
               $scope.labels2.push(i);
               $scope.data2.push(number_format(infoRelatorio['VGM'][i], 2, '.', ''));
            }

            $scope.layoutBeneficiarios(infoRelatorio);

            return JSON.stringify( infoRelatorio );
        };


        /**
         * Função que inicia a tela
         * 
         * @returns {void}
         */
        $scope._init = function() 
        {
            try {
                var coDeputado   = strstr($scope.selfUrl, '/', false).replace( /^\D+/g, ''),
                    infoDeputado = ModelDeputados.informacaoDoDeputado(coDeputado);
                    
                    
                ModelDespesas.listarDespesas(coDeputado, 2014, 1);
                $scope.preencherInfoDeputado(infoDeputado);
                
                var lstComissoes = ModelDeputados.listarComissoes(coDeputado);
                $.when(lstComissoes).then(function(r) {
                    $scope.layoutComissoes(r['dados']);
                });
                
                var lstCargos = ModelDeputados.listarCargos(coDeputado);
                $.when(lstCargos).then(function(r) {
                    $scope.layoutComissoes(r['dados']);
                });
                
            } catch (e) {console.log(e);}
        };


        /**
         * INIT: 
         */
        angular.element(document).ready(function() 
        {
            $scope.infoRelatorioDespesas();
            $scope._init();
        });

    }]);