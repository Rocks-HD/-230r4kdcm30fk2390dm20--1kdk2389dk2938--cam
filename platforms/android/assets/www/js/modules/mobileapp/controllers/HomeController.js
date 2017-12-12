'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('HomeController', ['$scope', '$location', '$timeout', 'ModelDeputados', 'ModelGeral', function HomeController($scope, $location, $timeout, ModelDeputados, ModelGeral) {
        $scope.APPLICATION_ENV  = ModelDeputados.APPLICATION_ENV;
        $scope.options;
        $scope.msgPainel;
        $scope.filter           = {'ds_nome' : '', 'ds_estado' : '', 'ds_partido' : ''};
        $scope.imgSelecionar    = './js/modules/mobileapp/layouts/imagens/background/background-deputado.svg';
        $scope.dpSelecionado1   = 0;
        $scope.dpSelecionado2   = 0;
        $scope.lstEstados       = new Array();
        $scope.lstPartidos      = new Array();


        /**
         * insere a lista de deputados
         * @param {type} data
         * @param {type} clear
         * @returns {undefined}
         */
        $scope.listaDeputados = function(data, clear) 
        {        
            try {
                if (clear === true) {$(".div-interna").html('');}

                if (typeof data['dados'] != 'undefined') {
                    for (var i in data['dados']) {$(".div-interna").append($scope.layoutItemDeputado(data['dados'][i]));}
                } else {
                    data = $("#order-2").is(":checked") ? data.reverse() : data;
                    for (var i in data) {
                        var dsNome      = $scope.filter['ds_nome'] ? $scope.filter['ds_nome'].toUpperCase() : '';
                        var filtroTotal = (dsNome == '' || removerAcento(data[i]['nome']).search(removerAcento(dsNome)) !== -1) && 
                                          ($scope.filter['ds_estado'] == '' || $scope.filter['ds_estado'] == null || $scope.filter['ds_estado'] == data[i]['siglaUf']) && 
                                          ($scope.filter['ds_partido'] == '' || $scope.filter['ds_partido'] == null || $scope.filter['ds_partido'] == data[i]['siglaPartido']);

                        if (filtroTotal == true) {
                            $(".div-interna").append($scope.layoutItemDeputado(data[i]));
                        }
                    }
                }

                $(".lista-deputados").scrollLeft(0);
                $(".div-interna").css('width', ((typeof data.length != 'undefined' && data.length != 0 ? data.length : 100)*100) +'px');
                
            } catch (e) {console.log(e);}
        };
        
        
        /**
         * Layout para preenchimento
         * 
         * @param {type} data
         * @returns {String}
         */
        $scope.layoutItemDeputado = function(data) 
        {
            var html = '<div class="box-deputado" data-id="'+ data['id'] +'">'+
                            '<img src="'+ data['urlFoto'] +'" alt="'+ data['nome'] +'"/>'+
                            '<h3>'+ data['nome'] +'</h3>'+
                            '<h4>'+ data['siglaUf'] +'/'+ data['siglaPartido'] +'</h4>'+
                        '</div>';
            return html;
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
                if (lstEstados[i] != '') {
                    $scope.lstEstados.push({
                        cod     : i,
                        name    : i,
                        total   : lstEstados[i]
                    });                    
                }
            }
            $scope.lstEstados = angular.copy($scope.lstEstados);
        };


        /**
         * Insere no select:ds_partido os partidos para formar filtro
         * 
         * @returns {void}
         */
        $scope.listarPartidos = function() 
        {
            $scope.lstPartidos = ModelDeputados.listarPartidos();
        };

        
        $scope.preencherInfoDeputado = function(infoDeputado) 
        {
            $(".infoNascimento").append(infoDeputado[0]['dataNascimento'].split('-').reverse().join('/'));
            $(".infoTelefone").append(infoDeputado[0]['dataNascimento']);
            $(".infoEmail").append(infoDeputado[0]['ultimoStatus']['gabinete']['email']);
            $(".infoEscolaridade").append(infoDeputado[0]['escolaridade']);
        };
        
        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
            window.location.hash = target;
            window.location.reload();
        };
        
        
        /**
         * Ação quando o usuário selecionar um candidato
         * 
         * @returns {void}
         */
        $scope.compararCandidatos = function() 
        {
            if ($scope.dpSelecionado1 != 0 && $scope.dpSelecionado2 != 0) {
                if ($(".ajaxCarregando").length == 0) {
                    $scope.redirecionar('/comparar/'+ $scope.dpSelecionado1+'-'+$scope.dpSelecionado2);
                } else {
                    $timeout(function() {
                        $scope.compararCandidatos();
                    }, 10000);
                }
            }
        };
        
        
        
        /**
         * 
         */
        $scope.ordenarDeputados = function() 
        {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            $scope.listaDeputados(lstDeputados, true);                        
        };

            
        /**
         * ON: Verifica se o usuário selecionou algum estado
         * 
         * @param string estadoSelect
         */
        $scope.filtrarEstado = function(estadoSelect) 
        {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_estado'] = estadoSelect;
            $scope.listaDeputados(lstDeputados, true);   
        };
        
        
        /**
         * ON: Verifica se o usuário selecionou algum partido
         * 
         * @param string partidoSelect
         */
        $scope.filtrarPartido = function(partidoSelect) 
        {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_partido'] = partidoSelect;
            $scope.listaDeputados(lstDeputados, true);            
        };

        /**
         * Função que é chamada quando um usuário clica sobre um deputado
         * 
         * @param {int} coDeputado
         * @returns {void}
         */
        $scope.selecionarDeputado = function(coDeputado, infoSelecionado) 
        {
            if ($("#deputadoSelecionado1 img").attr('src') == $scope.imgSelecionar && $scope.dpSelecionado2 != coDeputado ) {
                var infoDeputado = ModelDeputados.informacaoDoDeputado(coDeputado);
                $.when(infoDeputado).then(function(r) {
                    $("#deputadoSelecionado1").html(infoSelecionado);
                    $scope.dpSelecionado1 = coDeputado;
                });
            } else if ($("#deputadoSelecionado2 img").attr('src') == $scope.imgSelecionar && $scope.dpSelecionado1 != coDeputado ) {
                var infoDeputado = ModelDeputados.informacaoDoDeputado(coDeputado);
                $.when(infoDeputado).then(function(r) {
                    $("#deputadoSelecionado2").html(infoSelecionado);
                    $scope.dpSelecionado2 = coDeputado;
                });
            }
        };


        /**
         * ON: Executa ação quando um deputado for selecionado, seleção p/ comparação ou removido
         */
        var DELAY = 500, 
            clicks = 0, 
            timer = null;
        $(document).on("click", ".box-deputado", function() {

            var coDeputado  = $(this).attr('data-id'),
                self        = this;
            clicks++; 

            if (clicks == 1) {
                timer = setTimeout(function() {
                    var infoSelecionado = $(self).html(),
                        coDeputado      = $(self).attr('data-id');
                    
                    $scope.selecionarDeputado(coDeputado, infoSelecionado);
                    clicks = 0;
                }, DELAY);
            } else {
                clearTimeout(timer);  
                $scope.redirecionar('conheca/'+coDeputado);
                ModelDeputados.informacaoDoDeputado(coDeputado);
                clicks = 0;   
            }
            
        }).on("click", "#deputadoSelecionado1, #deputadoSelecionado2", function() {
            if ($(this).attr('id') == "deputadoSelecionado1") {
                $scope.dpSelecionado1 = 0;
            } else {
                $scope.dpSelecionado2 = 0;
            }
            
            $(this).html('<img src="'+ $scope.imgSelecionar +'">');
        });


        /**
         * ON: verifica se o usuário esta digitando alguma palavra
         */
        $(document).on("keyup", "#ds_nome", function() {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_nome'] = $("#ds_nome").val();
            $scope.listaDeputados(lstDeputados, true);
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
                $scope.listaDeputados(r, false);
                $scope.listarEstados();
                $scope.listarPartidos();
            });

        });

    }]);
