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
        
    }]);
        

