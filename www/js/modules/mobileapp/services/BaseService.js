'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('BaseService', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        this.identity           = {};
        this.lstDeputados       = new Array();
        this.lstEstados         = {};
        this.lstPartidos        = {};
        
        
        this.listarDeputados = function(pagina) 
        {           
            var rootObj         = this;
            var url             = 'https://dadosabertos.camara.leg.br/api/v2/deputados';
            var lstDeputados    = rootObj.listarDeputadosLocal(pagina, false);

            if (lstDeputados == null || lstDeputados.length == 0) {
                return $.get(url, {'itens' : '100', 'pagina': pagina}, function(r) {
                    if (typeof r['dados'] != 'undefined' && r['dados'].length != 0) {
                        rootObj.listarDeputados(++pagina);
                        for (var i in r['dados']) {
                            rootObj.lstEstados[r['dados'][i]['siglaUf']] = typeof rootObj.lstEstados[r['dados'][i]['siglaUf']] == 'undefined' ? 1 : rootObj.lstEstados[r['dados'][i]['siglaUf']]+1;
                            rootObj.lstPartidos[r['dados'][i]['siglaPartido']] = typeof rootObj.lstPartidos[r['dados'][i]['siglaPartido']] == 'undefined' ? 1 : rootObj.lstPartidos[r['dados'][i]['siglaPartido']]+1;
                            rootObj.lstDeputados.push(r['dados'][i]);
                        }
                    } else {
                        rootObj.salvarEstadosLocal(rootObj.lstEstados);
                        rootObj.salvarPartidosLocal(rootObj.lstPartidos);
                        return rootObj.salvarDeputadosLocal(rootObj.lstDeputados);
                    }
                }, 'json');
            } else {               
                return lstDeputados;
            }
        };       

        
        
        /**
         * Função que recebe o total de deputados e salva na base de dados do usuário
         * 
         * @param {array} lstDeputados
         * @return {array}
         */
        this.salvarDeputadosLocal = function(lstDeputados) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('deputados_'+ dtVisita, JSON.stringify(lstDeputados));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstDeputados;
        };

        
        
        /**
         * Salva a lista de estados existentes
         * 
         * @param {object} lstEstados
         * @return {array}
         */
        this.salvarEstadosLocal = function(lstEstados) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            
            if (typeof(Storage) !== "undefined") {
                console.log(lstEstados);
                localStorage.setItem('estados_'+ dtVisita, JSON.stringify(lstEstados));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstEstados;
        };
        
        
        /**
         * Salva a lista de partidos existentes e o seu quantitativo
         * 
         * @param {array} lstPartidos
         * @return {array}
         */
        this.salvarPartidosLocal = function(lstPartidos) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('partidos_'+ dtVisita, JSON.stringify(lstPartidos));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstPartidos;
        };
        
        /**
         * Retorna a lista de todos os deputados cadastrados naquele dia
         * 
         * @param {int} pagina
         * @returns {array}
         */
        this.listarDeputadosLocal = function(pagina, total) 
        {
            var dtVisita        = UtilsService._dataAtualVisita(),
                lstDeputados    = JSON.parse(localStorage.getItem('deputados_'+ dtVisita)),
                lstPaginacao    = new Array();
            
            if (total === false) {
                for (var i in lstDeputados) {
                    if ( i >= ((pagina-1)*100) && (i < (pagina*100)) ) {
                        lstPaginacao.push(lstDeputados[i]);
                    }
                }
            } else {
                lstPaginacao = lstDeputados;
            }
            
            return lstPaginacao;
        };
        
        
        /**
         * Retorna informações que poderão ser uteis no futuro
         * 
         * @returns {undefined}
         */
        this.estatisticaDeputadosBase = function() 
        {
            var lstDeputados = this.listarDeputadosLocal(1, true);
            
            //console.log(lstDeputados);
            
        };
        
        this.listarEstado = function() 
        {
            
        };
        
        
        this.listarPartidos = function() 
        {
            
        };
        
    }]);
        
