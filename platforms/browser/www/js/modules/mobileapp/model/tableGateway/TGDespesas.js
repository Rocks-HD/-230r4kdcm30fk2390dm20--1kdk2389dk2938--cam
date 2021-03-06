'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGDespesas', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        this.lstDepesas         = new Array();
        
        
        this.listarDespesas = function(coDeputado, ano, pagina) 
        {
            var rootObj        = this;
            var url            = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'+coDeputado+'/despesas?ano='+ ano +'&itens=100&pagina='+pagina+'&ordem=DESC&ordenarPor=numAno';
            var lstDespesas    = rootObj.listarDespesasLocal(coDeputado);

            if (lstDespesas == null || lstDespesas.length == 0) {
                return $.get(url, {}, function(r) {
                    if (typeof r['dados'] != 'undefined' && r['dados'].length != 0) {
                        rootObj.listarDespesas(coDeputado, ano, ++pagina);
                        for (var i in r['dados']) {
                            rootObj.lstDepesas.push(r['dados'][i]);
                        }
                    } else {
                        if (ano <= 2017) {
                            rootObj.listarDespesas(coDeputado, ++ano, 1);
                        } else {
                            return rootObj.salvarDespesas(rootObj.lstDepesas, coDeputado);
                        }
                    }
                }, 'json');
            } else {
                return lstDespesas;
            }
        };


        /**
         * Salva as informações de despesas referentes a um determinado candidato
         * 
         * @param {object} lstDespesas
         * @param {int} coDeputado
         * @returns {object}
         */
        this.salvarDespesas = function(lstDespesas, coDeputado) 
        {          
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('despesas_'+ coDeputado, JSON.stringify(lstDespesas));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstDespesas;
        };
        
        
        /**
         * 
         * @param {int} coDeputado
         * @returns {object}
         */
        this.listarDespesasLocal = function(coDeputado) 
        {
            try {
                var infoDeputado    = JSON.parse(localStorage.getItem('despesas_'+ coDeputado));
            } catch (e) {console.log(e);}
            
            return infoDeputado;
        };        
        
    }]);
        

