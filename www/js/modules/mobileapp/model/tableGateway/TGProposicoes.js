'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGProposicoes', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        
     
        /**
         * Retorna informações das proposições
         * 
         * @param {int} coDeputado
         * @param {string} dsNome
         * @returns {jqXHR}
         */
        this.listarProposicoesCandidato = function(coDeputado, dsNome) 
        {
            var rootObj         = this;
            var link            = 'http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes';
            var data            = {parteNomeAutor: dsNome, sigla: '', numero: '', ano : '', datApresentacaoIni: '', datApresentacaoFim: '', idTipoAutor: '', siglaPartidoAutor: '', siglaUFAutor: '', generoAutor: '', codEstado: '', codOrgaoEstado: '', emTramitacao: ''};
            var lstProposicoes  = rootObj.listarProposicoesCandidatoLocal(coDeputado);

            if (lstProposicoes == null || lstProposicoes.length == 0) {
                return $.get(link, data, function(r) {
                    lstProposicoes = $.xml2json(r)['#document']['proposicoes']['proposicao'];
                    rootObj.salvarProposicoesDeputadoLocal(coDeputado, lstProposicoes);
                    return lstProposicoes;
                }, 'xml');
            } else {               
                return lstProposicoes;
            }
        };
        
        
        /**
         * 
         * @param {type} coDeputado
         * @returns {undefined}
         */
        this.listarProposicoesCandidatoLocal = function(coDeputado) 
        {
            try {
                var lstProposicoes = JSON.parse(localStorage.getItem('proposicoes_'+ coDeputado));
            } catch (e) {console.log(e);}
            
            return lstProposicoes;
        };
        
        
        
        /**
         * 
         * @param {int} coDeputado
         * @return {array}
         */
        this.salvarProposicoesDeputadoLocal = function(coDeputado, lstProposicoes) 
        {           
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('proposicoes_'+ coDeputado, JSON.stringify(lstProposicoes));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstProposicoes;
        };        
        
    }]);
        

