'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('OpiniaoController', ['$scope', '$location', '$window', 'ModelProposicoes', 'ModelDeputados', function OpiniaoController($scope, $location, $window, ModelProposicoes, ModelDeputados) {
        $scope.selfUrl = $location.url();
        
        
        $scope.listarProposicoes = function() 
        {
            try {
                var ano                 = $("#ano").val(),
                    filtro              = $("#filtro").val(),
                    listarProposicoes   = ModelProposicoes.listarProposicoesVotadasEmPlenario(ano),
                    lstCodProposicao    = {},
                    lstOpiniao          = '',
                    contador            = 0;


                $(".areaDeOpniao").html('');
                $.when(listarProposicoes).then(function(prop1) {
                    var proposicoes = prop1 instanceof XMLDocument ? $.xml2json(prop1)['#document']['proposicoes']['proposicao'] : prop1;
                    for (var i in proposicoes) {
                        lstCodProposicao[proposicoes[i]['codProposicao']] = proposicoes[i]['nomeProposicao'];
                        if (++contador == 100) { break };
                    }
                    
                    var detalhesProposicoes = ModelProposicoes.detalhesProposicoes(lstCodProposicao);
                    $.when(detalhesProposicoes).then(function(detalhes) {
                        console.log(detalhes);
                        var html = '';
                        for (var i in detalhes['dados']) {
                            html =  '<div class="row linha-zebrada text-center padding-vertical item'+ detalhes['dados'][i]['id'] +'" data-id="'+ detalhes['dados'][i]['id'] +'">'+
                                        '<div class="col-xs-3"><h3><a href="'+detalhes['dados'][i]['uri']+'" target="_blank">'+ lstCodProposicao[detalhes['dados'][i]['id']] +'</a></h3>'+
                                            '<img src="./js/modules/mobileapp/layouts/imagens/icones/ico-mao-clique.svg" alt="clique e saiba mais" class="posicionamento-mao"/>'+
                                        '</div>'+
                                        '<div class="col-xs-6"><h6>'+ detalhes['dados'][i]['ementa'] +'</h6></div>'+
                                        '<div class="col-xs-3">'+
                                            '<span class="icon-ico-a-favor-1"></span><br>'+
                                            '<span class="icon-ico-contra-2"></span>'+
                                        '</div>'+
                                    '</div>';
                            $(".areaDeOpniao").append(html);
                        }
                        lstOpiniao = $scope.listarOpinioes();
                        
                        if (filtro == 'votados') {
                            $(".areaDeOpniao .linha-zebrada").addClass('hidden');
                            for (var i in lstOpiniao) {
                                $(".item"+lstOpiniao[i]['coProposicao']).removeClass('hidden');
                            }
                        } else if (filtro == 'naoVotados') {
                            for (var i in lstOpiniao) {
                                $(".item"+lstOpiniao[i]['coProposicao']).addClass('hidden');
                            }
                        }
                    });
                });
    
            } catch (e) {window.location.reload();}            
        };
        
        
        /**
         * 
         * @param {type} coProposicao
         * @returns {undefined}
         */
        $scope.salvarOpiniao = function(coProposicao, tpVoto) 
        {
            var opniao = {'coProposicao': coProposicao, 'tpVoto': tpVoto};
                        
            $(".item"+ coProposicao +" .icon-ico-a-favor-1, .item"+coProposicao+" .icon-ico-contra-2").removeClass('active');
            $(".item"+ coProposicao +" "+ (tpVoto == 'favor' ? '.icon-ico-a-favor-1' : '.icon-ico-contra-2')).addClass('active');
            
            ModelProposicoes.salvarOpiniao(opniao);
        };        
        
        
        
        $(document).on("click", ".icon-ico-a-favor-1, .icon-ico-contra-2", function() {
            var coProposicao = $(this).parent().parent().attr('data-id'),
                tpOpniao     = $(this).hasClass('icon-ico-a-favor-1') ? 'favor' : 'contra';
                
            $scope.salvarOpiniao(coProposicao, tpOpniao);
        });
        
        
        /**
         * 
         * @returns {undefined}
         */
        $scope.listarOpinioes = function() 
        {
            var lstOpnioes = ModelProposicoes.listarOpinioes();
            
            for (var i in lstOpnioes) {
                var tpEscolha = lstOpnioes[i]['tpVoto'] == 'favor' ? '.icon-ico-a-favor-1' : '.icon-ico-contra-2';
                
                $(".item"+lstOpnioes[i]['coProposicao']+" "+tpEscolha).addClass('active');
            }
            
            return lstOpnioes;
        };



        $(document).on("change", "#ano", function() {
            $scope.listarProposicoes();
        });
        
        $(document).on("change", "#filtro", function() {
            $scope.listarProposicoes();
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
            $scope.listarProposicoes();
        });     

    }]);