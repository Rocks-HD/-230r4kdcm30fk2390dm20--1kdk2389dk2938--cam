'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGVotacoes', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  


        /**
         * 
         * @returns {jqXHR}
         */
        this.lstProposicoes = function(coPartido) 
        {
            var url             = 'https://dadosabertos.camara.leg.br/api/v2/proposicoes?itens=100&ordem=DESC&ordenarPor=id';

            return $.get(url, {}, function(r) {
                return r;
            }, 'json');
        };    

    }]);
        

