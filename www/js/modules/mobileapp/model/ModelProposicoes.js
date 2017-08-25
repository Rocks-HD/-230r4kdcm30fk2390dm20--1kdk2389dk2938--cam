
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelProposicoes', ['UtilsService', 'TGProposicoes', function(UtilsService, TGProposicoes) {
        
        
        /**
         * 
         * 
         * @returns {object}
         */
        this.listarProposicoesCandidato = function(coDeputado, dsNome) 
        {
            var lstProposicoes = TGProposicoes.listarProposicoesCandidato(coDeputado, dsNome);

            return $.when(lstProposicoes).then(function(r) {
                if (typeof r != 'object') {
                    return $.xml2json(r)['#document']['proposicoes']['proposicao'];
                } else {
                    return r;
                }
            });
        };


        /**
         * Lista apenas as proposições votadas em plenario
         */
        this.listarProposicoesVotadasEmPlenario = function(ano, tipo) 
        {
            return TGProposicoes.listarProposicoesVotadasEmPlenario(ano, tipo);
        };


        /**
         * detalhes das proposicoes
         */
        this.detalhesProposicoes = function(arrayCodigos) 
        {
            return TGProposicoes.detalhesProposicoes(arrayCodigos);
        };
    }]);
        
