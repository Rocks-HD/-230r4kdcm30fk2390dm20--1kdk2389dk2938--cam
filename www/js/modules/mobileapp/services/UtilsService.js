'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:UtilsService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('UtilsService', function() {
        
        this.formLatLong;
        
        /**
         * Pega a posição geográfica do usuário
         * 
         * @returns {undefined}
         */
        this._getLatLong = function() 
        {   
            if ("geolocation" in navigator) {
                this.formLatLong = navigator.geolocation.watchPosition(function(position) {
                    return position.coords.latitude+';'+position.coords.longitude;
                });        
            } else {
                alert('Não foi possível identificar sua localização, portanto não será possível enviar as informações dos formulários abaixo.');
            }
        };
        
        
        /**
         * Função necessária para gerar um random id
         * 
         * @returns {string}
         */
        this._random = function()
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 10; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };


        /**
         * Função que preenche o campo de data.
         *   -- retorno utilizado apenas para visualização na área de pendencias
         *      quando o mesmo esta salvo na base de dados.
         * 
         * @return {string}
         */
        this._dataAtualFormatada = function() 
        {
            var data    = new Date();
            var dia     = (data.getDate().toString().length == 1) ? '0'+data.getDate() : data.getDate();
            var mes     = (data.getMonth().toString().length == 1) ? '0'+(data.getMonth()+1) : (data.getMonth()+1);
            var ano     = data.getFullYear();
            var hora    = data.getHours() +':'+ data.getMinutes();

            return dia+"/"+mes+"/"+ano +' às '+ hora;
        };
});
