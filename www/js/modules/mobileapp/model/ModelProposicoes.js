
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
         * @param {type} opniao
         * @returns {undefined}
         */
        this.salvarOpiniao = function(opniao) 
        {
            return TGProposicoes.salvarOpiniao(opniao);
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
        this.obterVotacaoProposicaoPorId = function(arrProposicoes, coProposicao) 
        {
            var infoProposicao  = TGProposicoes.obterVotacaoProposicaoPorId(coProposicao);
            
            $.when(infoProposicao).then(function(prop1) {
                this.proposicoes = prop1 instanceof XMLDocument ? $.xml2json(prop1)['#document']['proposicao']['Votacoes']['Votacao'] : prop1;

                if (typeof arrProposicoes[++this.contador] != 'undefined') {
                    
                    this.obterVotacaoProposicaoPorId(arrProposicoes, arrProposicoes[this.contador]['coProposicao']);
                } else {
                    localStorage.setItem('ranking', JSON.stringify(this.proposicoes));
                };
            });
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
        
