'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('HomeController', ['$scope', '$location', '$window', 'BaseService', function($scope, $location, $window, BaseService) {
        $scope.APPLICATION_ENV  = BaseService.APPLICATION_ENV;
        $scope.url              = BaseService.url;  
        $scope.options;
        $scope.msgPainel;
        $scope.filter           = {'ds_nome' : '', 'ds_estado' : '', 'ds_partido' : ''};
        $scope.imgSelecionar    = '/js/modules/mobileapp/layouts/imagens/background/background-deputado.svg';
        $scope.dpSelecionado1   = 0;
        $scope.dpSelecionado2   = 0;


        /**
         * insere a lista de deputados
         * @param {type} data
         * @param {type} clear
         * @returns {undefined}
         */
        $scope.listaDeputados = function(data, clear) 
        {            
            if (clear === true) {$(".div-interna").html('');}
            
            if (typeof data['dados'] != 'undefined') {
                for (var i in data['dados']) {$(".div-interna").append($scope.layoutItemDeputado(data['dados'][i]));}
            } else {
                for (var i in data) {
                    var dsNome      = $scope.filter['ds_nome'] ? $scope.filter['ds_nome'].toUpperCase() : '';
                    var filtroTotal = (dsNome == '' || removerAcento(data[i]['nome']).search(removerAcento(dsNome)) !== -1) && 
                                      ($scope.filter['ds_estado'] == '' || $scope.filter['ds_estado'] == data[i]['siglaUf']) && 
                                      ($scope.filter['ds_partido'] == '' || $scope.filter['ds_partido'] == data[i]['siglaPartido']);

                    if (filtroTotal == true) {
                        $(".div-interna").append($scope.layoutItemDeputado(data[i]));
                    }
                }
            }
            console.log(length);
            $(".div-interna").css('width', ((data.length != 0 ? data.length : 100)*100) +'px');            
        };


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
            var lstEstados = BaseService.listarEstadosLocal();
            
            for (var i in lstEstados) {
                $("#ds_estado").append('<option value="'+ i +'">'+ i +'</option>');
            }
        };


        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.listarDeputados = function() 
        {
            var lstPartidos = BaseService.listarPartidosLocal();
            
            for (var i in lstPartidos) {
                $("#ds_partido").append('<option value="'+ i +'">'+ i +'</option>');
            }
        };

        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
//            $location.path('#/'+target);  
            $window.location = '/#/'+target;
        };
        
        
        
        $(document).on("click", "#btn-menu", function () {
            $(".menu-principal").slideToggle();
            $("header #btn-menu span").toggleClass("muda-cor-btn-menu");
        });
        $(document).on('click', ".menu-principal a", function() {
            $(".menu-principal").hide();
            return false;
        });
        
        
        /**
         * Quando o usuário clicar em qualquer botão padrão do sistema que envie o formulário
         */
        $(document).on("click", "#btnEnviar", function() {

        });

        
        

        
        
        
        /**
         * ON: Verifica se o usuário selecionou algum estado
         */
        $(document).on("change", "#ds_estado", function() {
            var lstDeputados = BaseService.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_estado'] = $("#ds_estado").val();
            $scope.listaDeputados(lstDeputados, true);            
        });
        
        /**
         * ON: Verifica se o usuário selecionou algum partido
         */
        $(document).on("change", "#ds_partido", function() {
            var lstDeputados = BaseService.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_partido'] = $("#ds_partido").val();
            $scope.listaDeputados(lstDeputados, true);            
        });


        /**
         * ON: Executa ação quando um deputado for selecionado, seleção p/ comparação ou removido
         */
        var DELAY = 700, clicks = 0, timer = null;
        $(document).on("click", ".box-deputado", function() {
            clicks++; 
            
            if (clicks === 1) {
                
                timer = setTimeout(function() {
                    var infoSelecionado = $(this).html(),
                        coDeputado      = $(this).attr('data-id');

                    if ($("#deputadoSelecionado1 img").attr('src') == $scope.imgSelecionar && $scope.dpSelecionado2 != coDeputado ) {
                        $("#deputadoSelecionado1").html(infoSelecionado);
                        $scope.dpSelecionado1 = coDeputado;
                    } else if ($("#deputadoSelecionado2 img").attr('src') == $scope.imgSelecionar && $scope.dpSelecionado1 != coDeputado ) {
                        $("#deputadoSelecionado2").html(infoSelecionado);
                        $scope.dpSelecionado2 = coDeputado;
                    }
                    clicks = 0;
                    
                }, DELAY);
            } else {
                var coDeputado = $(this).attr('data-id');
                
                clearTimeout(timer);  
                $scope.redirecionar('ranking');
                
                clicks = 0;   
            }
            
        }).on("click", "#deputadoSelecionado1, #deputadoSelecionado2", function() {
            $(this).html('<img src="'+ $scope.imgSelecionar +'">');
            
        });



        /**
         * ON: verifica se o usuário esta digitando alguma palavra
         */
        $(document).on("keyup", "#ds_nome", function() {
            var lstDeputados = BaseService.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_nome'] = $("#ds_nome").val();
            $scope.listaDeputados(lstDeputados, true);
        });


        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            var lstDeputados = BaseService.listarDeputados(1);

            $.when(lstDeputados).then(function(r) {
                $scope.listaDeputados(r, false);
                $scope.listarEstados();
                $scope.listarDeputados();
            });       
        });

    }]);