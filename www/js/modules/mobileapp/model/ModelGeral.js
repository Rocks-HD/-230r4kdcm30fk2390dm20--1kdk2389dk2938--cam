
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelGeral', ['UtilsService', 'TGGeral', function(UtilsService, TGGeral) {
                
        /**
         * Remove todas as informações da base de dados
         * @returns {void}
         */
        this.limparBaseGeral = function() 
        {
            return TGGeral.limparBaseGeral();
        };
        
        
        /**
         * Lista os estados que possuem representação de deputados e o número de 
         * deputados do respectivo estado
         *     -- Importante para a listagem de estados da tela inicial
         *     -- Importante para gerar gráfico de representatividade
         * 
         * @returns {object}
         */
        this.listarEstadosLocal = function() 
        {
            return TGGeral.listarEstadosLocal();
        };
                
        /**
         * Lista os partidos 
         * @returns {unresolved}
         */
        this.listarPartidosLocal = function() 
        {
            return TGGeral.listarPartidosLocal();
        };
        
        /**
         * Exibe informações detalhadas de um determinado bloco
         * 
         * @param {string} coBloco
         * @returns {undefined}
         */
        this.infoBlocoPartidario = function(coBloco) 
        {
            var lstBlocos = TGGeral.listarBlocosPartidarios()['blocos']['bloco'];
            
            for (var i in lstBlocos) {
                if (lstBlocos[i]['nomeBloco'] == coBloco) {
                    return lstBlocos[i];
                    break;
                }
            }
        };
        
        
        /**
         * lista os blocos partidários.
         *   -- Interessante utilizar esta função em conjunto com a listarPartidos
         *      para saber o número representativo de cada bloco partidário
         *      
         * @returns {object}
         */
        this.listarBlocoPartidario = function() 
        {
            var lstBlocoPartidario  = TGGeral.listarBlocosPartidarios();
            var lstPartidosLocal    = this.listarPartidosLocal();
            var padraoBloco         = {};

            $.when(lstBlocoPartidario).then(function(r) {
                if (typeof r['blocos'] != 'undefined') {
                    var lstBlocos = r['blocos']['bloco'];

                    for (var i in lstBlocos) {
                        for (var p in lstBlocos[i]['Partidos']['partido']) {
                            padraoBloco[lstBlocos[i]['nomeBloco']] = 
                                parseInt(typeof padraoBloco[lstBlocos[i]['nomeBloco']] != 'undefined' ? padraoBloco[lstBlocos[i]['nomeBloco']] : 0) +
                                parseInt(typeof lstPartidosLocal[ lstBlocos[i]['Partidos']['partido'][p]['siglaPartido'] ] != 'undefined' ? lstPartidosLocal[ lstBlocos[i]['Partidos']['partido'][p]['siglaPartido'] ] : 0); 
                        }
                    }
                    
                    return padraoBloco;
                }
            });
            
            return padraoBloco;
        };
        
        
        /**
         * Lista os orgaos existentes e filtra o resultado para comissões permanentes
         * 
         * @returns {object}
         */
        this.listarOrgaos = function() 
        {
            var lstOrgaos       = TGGeral.listarOrgaos();
            var lstResultado    = new Array();
            $.when(lstOrgaos).then(function(r) {
                if (typeof lstOrgaos['orgaos'] != 'undefined') {
                    var orgao = lstOrgaos['orgaos']['orgao'];
                    for (var i in orgao) {
                        if (orgao[i]['$']['idTipodeOrgao'] === '2') {
                            lstResultado.push(orgao[i]['$']);                        
                        }
                    }
                }
            });

            return lstResultado;
        };
        
        
        /**
         * Retorna informações dos membros que compôem uma determinada comissão
         * 
         * @param int coOrgao
         * @returns {object}
         */
        this.obterMembrosOrgao = function(coOrgao) 
        {
            return TGGeral.obterMembrosOrgao(coOrgao);
        };
    }]);
        

