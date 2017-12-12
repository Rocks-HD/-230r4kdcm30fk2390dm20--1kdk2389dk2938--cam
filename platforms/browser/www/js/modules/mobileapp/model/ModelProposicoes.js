
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
        this.listarProposicoesCandidato = function(dsNome) 
        {
            var lstProposicoes = TGProposicoes.listarProposicoesCandidato(dsNome);

            return $.when(lstProposicoes).then(function(r) {
                return $.xml2json(r)['#document']['proposicoes']['proposicao'];
            });
        };

    }]);
        
