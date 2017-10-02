'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGGeral', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  

        /**
         * Limpa as informações da base.
         *   -- importante utilizar na inicialização da aplicação
         *   
         * @returns {void}
         */
        this.limparBaseGeral = function() 
        {
            if (typeof(Storage) !== "undefined") {
                localStorage.clear();
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
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
         * Retorna a lista de estados previamente cadastrados na base
         * 
         * @returns {Array}
         */
        this.listarEstadosLocal = function() 
        {
            try {
                var dtVisita        = UtilsService._dataAtualVisita(),
                    lstEstados      = JSON.parse(localStorage.getItem('estados_'+ dtVisita)),
                    lstEstadosOrd   = {};

                Object.keys(lstEstados).sort().forEach(function(key) {
                  lstEstadosOrd[key] = lstEstados[key];
                });

            } catch (e) {/** console.log(e); */}
            
            return lstEstadosOrd;
        };
        
        
        /**
         * Retorna a lista de partidos previamente cadastrados na base
         * 
         * @returns {Array}
         */
        this.listarPartidosLocal = function() 
        {
            try {
                var dtVisita        = UtilsService._dataAtualVisita(),
                    lstPartidos     = JSON.parse(localStorage.getItem('partidos_'+ dtVisita)),
                    lstPartidosOrd  = {};

                Object.keys(lstPartidos).sort().forEach(function(key) {
                    lstPartidosOrd[key] = lstPartidos[key];
                });
            } catch (e) {/** console.log(e); */}
            
            return lstPartidos;

        };
        
        
        /**
         * Função que preenche as informações do campo blocos partidários
         * 
         * @returns {void}
         */
        this.listarBlocosPartidarios = function() 
        {
            try {
                var rootObj     = this;
                var infoBlocos  = rootObj.infoBlocosPartidarios();

                if (infoBlocos == null || infoBlocos.length == 0) {
                    return $.post('http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterPartidosBlocoCD', {idBloco: '', numLegislatura: ''}, function(r) {
                        return rootObj.salvarBlocosPartidarios(r);
                    });
                }
            } catch (e) {
                console.log(e);
            }
            
            return infoBlocos;
        };
        
        
        /**
         * Lista os blocos partidários
         * 
         * @returns {Array|Object}
         */
        this.infoBlocosPartidarios = function() 
        {
            try {
                var dtVisita    = UtilsService._dataAtualVisita();
                var infoBlocos  = JSON.parse(localStorage.getItem('blocos_'+ dtVisita));

            } catch (e) {console.log(e);}
            
            return infoBlocos;
        };
        
        
        /**
         * Função que preenche as informações do campo blocos partidários
         * 
         * @returns {void}
         */
        this.salvarBlocosPartidarios = function(lstBlocos) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('blocos_'+ dtVisita, JSON.stringify($.xml2json(lstBlocos)['#document']));
                return $.xml2json(lstBlocos)['#document'];       
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
        };
        
        
        /**
         * 
         * @returns {object}
         */
        this.listarOrgaos = function() 
        {
            var url = 'https://dadosabertos.camara.leg.br/api/v2/orgaos?itens=100&ordem=DESC&ordenarPor=sigla';

            return $.get(url, {}, function(r) {
                return r;
            }, 'json');            
        };        
        
    }]);
        

