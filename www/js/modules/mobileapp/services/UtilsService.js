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
        
        
        /**
         * Função que retorna apenas a data 
         * 
         * @returns {String}
         */
        this._dataAtualVisita = function() 
        {
            var data    = new Date();
            var dia     = (data.getDate().toString().length == 1) ? '0'+data.getDate() : data.getDate();
            var mes     = (data.getMonth().toString().length == 1) ? '0'+(data.getMonth()+1) : (data.getMonth()+1);
            var ano     = data.getFullYear();

            return ano+""+mes+""+dia;
        };  
        
        
        /**
         * Converte um xml em json
         * @param {string} xml
         * 
         * @returns {UtilsServiceL#10.xmlToJson.obj}
         */
        this.xmlToJson = function (xml) {

            // Create the return object
            var obj = {};

            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            // If just one text node inside
            if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
                obj = xml.childNodes[0].nodeValue;
            } else if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof (obj[nodeName]) == "undefined") {
                        obj[nodeName] = xmlToJson(item);
                    } else {
                        if (typeof (obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(xmlToJson(item));
                    }
                }
            }
            return obj;
        };     
});
