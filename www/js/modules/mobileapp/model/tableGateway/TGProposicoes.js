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
                localStorage.removeItem('proposicoes_'+coDeputado);
                return lstProposicoes;
            }
        };
        
        
        /**
         * 
         */
        this.obterVotacaoProposicaoPorId = function(coProposicao) 
        {
            var link = 'http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ObterVotacaoProposicaoPorID';
            return $.get(link, {idProposicao : coProposicao}, function(r) {
                var lstProposicoes = $.xml2json(r)['#document']['proposicao']['Votacoes']['Votacao'];
                return lstProposicoes;
            }, 'xml');            
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
                //localStorage.setItem('proposicoes_'+ coDeputado, JSON.stringify(lstProposicoes));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstProposicoes;
        };        
        
        
        /**
         * 
         * @param {type} ano
         * @param {type} tipo
         * @returns {jqXHR}
         */
        this.listarProposicoesVotadasEmPlenario = function(anoBusca) 
        {
            var url = 'http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoesVotadasEmPlenario?ano='+anoBusca+'&tipo=';

            return $.get(url, {}, function(r) {
                return $.xml2json(r)['#document']['proposicoes']['proposicao'];
            }, 'xml');
        };
        
        
        /**
         * 
         * @param array arrayCod
         * @returns {jqXHR}
         */
        this.detalhesProposicoes = function(arrayCod) 
        {
            var lstId = Object.keys(arrayCod).join('&id=');
            console.log(lstId);
            
            var url = 'https://dadosabertos.camara.leg.br/api/v2/proposicoes?id='+lstId+'&itens=100&ordem=ASC&ordenarPor=id';
            var data = {};

            return $.get(url, data, function(r) {
                return r;
            }, 'json');
        };
        
        
        /**
         * 
         * @param {type} opniao
         * @returns {undefined}
         */
        this.salvarOpiniao = function(opniao) 
        {
            var lstOpinioes     = this.listarOpinioes(),
                itensOpnioes    = new Array();
            
            if (typeof(Storage) !== "undefined") {
                if (lstOpinioes == null || lstOpinioes.length == 0) {
                    itensOpnioes.push(opniao);
                } else {
                    for (var i in lstOpinioes) {
                        if (opniao['coProposicao'] == lstOpinioes[i]['coProposicao']) {
                            delete lstOpinioes[i];
                        }
                    }
                    
                    lstOpinioes.push(opniao);
                    
                    for (var i in lstOpinioes) {
                        if (typeof lstOpinioes[i]['coProposicao'] != 'undefined') {
                            itensOpnioes.push(lstOpinioes[i]);
                        }
                    }
                }                
                localStorage.setItem('opiniao', JSON.stringify(itensOpnioes));

            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstOpinioes;
        };
        
        /**
         * 
         * @param {type} proposicao
         * @returns {undefined}
         */
        this.listarOpinioes = function() 
        {
            return JSON.parse(localStorage.getItem('opiniao'));
        };
        
              
    }]);
        

