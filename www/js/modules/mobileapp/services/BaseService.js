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
        
        
        /**
         * Função que salva as informações do funcionário
         * 
         * @returns {void}
         */
        this.salvarIdentificacao = function(orgOrigem) 
        {
            localStorage.setItem('coFuncionario', orgOrigem);
            window.location.hash = '/';
        };        
        
        
        /**
         * Garante que a variável orgOrigem estará preenchida com as informações do orgão de origem
         * 
         * @returns {string}
         */
        this.recuperarIdentificacao = function() 
        {
            this.identity.coFuncionario = localStorage.getItem('co_funcionario');

            return this.identity.coFuncionario;
        };
        
        
        /**
         * Retorna as informações básicas da identidade do usuário
         * 
         * @returns {Array|Object}
         */
        this.getIdentity = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('identity_'+ dtVisita));
        };
    }]);
        
