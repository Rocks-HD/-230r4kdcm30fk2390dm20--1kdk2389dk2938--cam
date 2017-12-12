
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelProposicoes', ['UtilsService', 'TGProposicoes', function(UtilsService, TGProposicoes) {
        this.infoProposicao = {};
        this.candidatos     = {};
        this.proposicoes    = {};
        this.contador       = 0;
        
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
        this.listarProposicoesVotadasEmPlenario = function(ano) 
        {
            return TGProposicoes.listarProposicoesVotadasEmPlenario(ano);
        };


        /**
         * detalhes das proposicoes
         */
        this.detalhesProposicoes = function(arrayCodigos) 
        {
            return TGProposicoes.detalhesProposicoes(arrayCodigos);
        };
        
        /**
         * 
         * @param {type} opiniao
         * @returns {undefined}
         */
        this.salvarOpiniao = function(opiniao) 
        {
            return TGProposicoes.salvarOpiniao(opiniao);
        };
        
        /**
         * 
         * @param {type} opiniao
         * @returns {void}
         */
        this.salvarOpinioes = function(lstOpinioes) 
        {
            return TGProposicoes.salvarOpiniao(lstOpinioes);
        };
        
        /**
         * 
         * @param {type} proposicao
         * @returns {undefined}
         */
        this.listarOpinioes = function() 
        {
            return TGProposicoes.listarOpinioes();
        };
        
        
        /**
         * 
         * @param {type} coProposicao
         * @returns {undefined}
         */
        this.obterVotacaoProposicaoPorId = function(coProposicao) 
        {
            return TGProposicoes.obterVotacaoProposicaoPorId(coProposicao);
        };
        
        
        /**
         * 
         * @param {type} arrProposicoes
         * @returns {undefined}
         */
        this.timeoutObterVotacaoProposicaoPorId = function(arrProposicoes) 
        {
            if (typeof arrProposicoes[0] != 'undefined') {
                this.obterVotacaoProposicaoPorId(arrProposicoes, arrProposicoes[0]['coProposicao']);
            }
            
        };
    }]);
        
