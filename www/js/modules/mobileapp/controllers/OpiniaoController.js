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
                    tipo                = $("#tipo").val(),
                    listarProposicoes   = ModelProposicoes.listarProposicoesVotadasEmPlenario(ano, tipo),
                    lstCodProposicao    = {},
                    contador            = 0;

                $.when(listarProposicoes).then(function(prop1) {
                    var proposicoes = prop1 instanceof XMLDocument ? $.xml2json(prop1)['#document']['proposicoes']['proposicao'] : prop1;
                    for (var i in proposicoes) {
                        lstCodProposicao[proposicoes[i]['codProposicao']] = proposicoes[i]['nomeProposicao'];
                        if (++contador == 100) { break };
                    }
                    
                    var detalhesProposicoes = ModelProposicoes.detalhesProposicoes(lstCodProposicao);
                    $.when(detalhesProposicoes).then(function(detalhes) {
                        var html = '';
                        for (var i in detalhes['dados']) {
                            html =  '<div class="row linha-zebrada text-center padding-vertical">'+
                                        '<div class="col-xs-4"><h3>'+ lstCodProposicao[detalhes['dados'][i]['id']] +'</h3><img src="./js/modules/mobileapp/layouts/imagens/icones/ico-mao-clique.svg" alt="clique e saiba mais" class="posicionamento-mao"/></div>'+
                                        '<div class="col-xs-4"><h6>'+ detalhes['dados'][i]['ementa'] +'</h6></div>'+
                                        '<div class="col-xs-4"><span class="icon-ico-a-favor-1"></span><br><span class="icon-ico-contra-2"></span></div>'+
                                    '</div>';
                            $(".areaDeOpniao").append(html);
                        }
                    });
                });
    
            } catch (e) {window.location.reload();}            
        };
        
        $scope.layoutProposicao = function() 
        {
            
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
            $scope.listarProposicoes();

        });     

    }]);