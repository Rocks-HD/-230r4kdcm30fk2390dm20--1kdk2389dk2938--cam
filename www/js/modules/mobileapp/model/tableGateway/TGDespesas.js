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
        this.infoAnterior       = {};
        this.erroLstDespesas    = false;
        
        this.listarDespesas = function(coDeputado, ano, pagina) 
        {
            try {
                if (this.erroLstDespesas == false) {
                    var rootObj        = this;
                    var url            = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'+coDeputado+'/despesas?ano='+ ano +'&itens=100&pagina='+ (pagina != null ? pagina : 1) +'&ordem=DESC&ordenarPor=numAno';
                    var lstDespesas    = rootObj.listarDespesasLocal(coDeputado);

                    if (lstDespesas == null || lstDespesas.length == 0) {
                        return $.get(url, {}, function(r) {
                            if (typeof r['dados'] != 'undefined' && r['dados'].length != 0) {
                                rootObj.listarDespesas(coDeputado, ano, ++pagina);
                                for (var i in r['dados']) {
                                    this.infoAnterior = r['dados'][i];
                                    rootObj.lstDepesas.push(r['dados'][i]);
                                }
                            } else {
                                if (ano >= 2015 && ano <= 2019) {
                                    rootObj.listarDespesas(coDeputado, ++ano, 1);
                                } else {
                                    return rootObj.salvarDespesas(rootObj.lstDepesas, coDeputado);
                                }
                            }
                        }, 'json').fail(function() {
                            console.log('Erro no webservice');
                            this.erroLstDespesas = true;
                        });
                    } else {
                        localStorage.removeItem('despesas_'+coDeputado);
                        return lstDespesas;
                        
                    }      
                }
            } catch (e) {console.log(e);}
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
            try {
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem('despesas_'+ coDeputado, JSON.stringify(lstDespesas));
                } else {
                    console.log('O dispositivo não permite salvar informações!');
                }
            } catch (e) {console.log(e);}

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
        

