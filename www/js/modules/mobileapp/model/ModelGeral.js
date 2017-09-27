
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelGeral', ['UtilsService', 'TGGeral', function(UtilsService, TGGeral) {
                
        
        this.listarEstadosLocal = function() 
        {
            return TGGeral.listarEstadosLocal();
        };
                
        
        this.listarPartidosLocal = function() 
        {
            return TGGeral.listarPartidosLocal();
        };
        
        
        
    }]);
        

