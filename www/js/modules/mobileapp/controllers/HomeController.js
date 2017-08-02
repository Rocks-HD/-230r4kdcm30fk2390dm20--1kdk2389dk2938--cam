'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('HomeController', ['$scope', '$location', '$window', 'BaseService', function($scope, $location, $window, BaseService) {
        $scope.APPLICATION_ENV  = BaseService.APPLICATION_ENV;
        $scope.url              = BaseService.url;  
        $scope.options;
        $scope.msgPainel;
        
        //Itens necessários para o projeto de visita. Ativados pela função "angular.element(document).ready"
        $scope.identity         = BaseService.identity;

        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
            $location.path('/'+target);  
            $window.location.reload();
        };
        
        
        /**
         * Quando o usuário clicar em qualquer botão padrão do sistema que envie o formulário
         */
        $(document).on("click", "#btnEnviar", function() {

        });

        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            
        });

    }]);