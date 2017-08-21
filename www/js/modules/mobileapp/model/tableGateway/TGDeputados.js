'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGDeputados', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        this.identity           = {};
        this.infoDeputados      = new Array();
        this.infoDeputado       = new Array();
        this.lstEstados         = {};
        this.lstPartidos        = {};
        

        this.listarDeputados = function(pagina) 
        {           
            var rootObj         = this;
            var url             = 'https://dadosabertos.camara.leg.br/api/v2/deputados';
            var lstDeputados    = rootObj.listarDeputadosLocal(pagina, false);

            if (lstDeputados == null || lstDeputados.length == 0) {
                return $.get(url, {'itens' : '100', 'pagina': pagina}, function(r) {
                    if (typeof r['dados'] != 'undefined' && r['dados'].length != 0) {
                        rootObj.listarDeputados(++pagina);
                        for (var i in r['dados']) {
                            rootObj.lstEstados[r['dados'][i]['siglaUf']] = typeof rootObj.lstEstados[r['dados'][i]['siglaUf']] == 'undefined' ? 1 : rootObj.lstEstados[r['dados'][i]['siglaUf']]+1;
                            rootObj.lstPartidos[r['dados'][i]['siglaPartido']] = typeof rootObj.lstPartidos[r['dados'][i]['siglaPartido']] == 'undefined' ? 1 : rootObj.lstPartidos[r['dados'][i]['siglaPartido']]+1;
                            rootObj.infoDeputados.push(r['dados'][i]);
                        }
                    } else {
                        rootObj.salvarEstadosLocal(rootObj.lstEstados);
                        rootObj.salvarPartidosLocal(rootObj.lstPartidos);
                        return rootObj.salvarDeputadosLocal(rootObj.infoDeputados);
                    }
                }, 'json');
            } else {               
                return lstDeputados;
            }
        };
        
        
        /**
         * Retorna informação do webservice ou da base de dados
         * 
         * @param {int} coDeputado
         * @returns {object}
         */
        this.informacaoDoDeputado = function(coDeputado) 
        {
            var rootObj         = this;
            var url             = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'+coDeputado;
            var infoDeputado    = rootObj.infoDeputadoLocal(coDeputado);

            if (infoDeputado == null || infoDeputado.length == 0) {
                return $.get(url, {}, function(r) {
                    rootObj.infoDeputado.push(r['dados']);
                    return rootObj.salvarDeputadoLocal(rootObj.infoDeputado, coDeputado);
                }, 'json');
            } else {               
                return infoDeputado;
            }
        };
        

        
        
        /**
         * Função que recebe o total de deputados e salva na base de dados do usuário
         * 
         * @param {array} lstDeputados
         * @return {array}
         */
        this.salvarDeputadosLocal = function(lstDeputados) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('deputados_'+ dtVisita, JSON.stringify(lstDeputados));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return lstDeputados;
        };


        /**
         * Salva informações de um deputado específico 
         * 
         * @param {type} infoDeputado
         * @returns {undefined}
         */
        this.salvarDeputadoLocal = function(infoDeputado, coDeputado) 
        {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('deputado_'+ coDeputado, JSON.stringify(infoDeputado));
            } else {
                console.log('O dispositivo não permite salvar informações!');
            }
            
            return infoDeputado;
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
         * Retorna a lista de todos os deputados cadastrados naquele dia
         * 
         * @param {int} pagina
         * @returns {array}
         */
        this.listarDeputadosLocal = function(pagina, total) 
        {
            try {
                var dtVisita        = UtilsService._dataAtualVisita(),
                    lstDeputados    = JSON.parse(localStorage.getItem('deputados_'+ dtVisita)),
                    lstPaginacao    = new Array();

                if (total === false) {
                    for (var i in lstDeputados) {
                        if ( i >= ((pagina-1)*100) && (i < (pagina*100)) ) {
                            lstPaginacao.push(lstDeputados[i]);
                        }
                    }
                } else {
                    lstPaginacao = lstDeputados;
                }  
            } catch (e) {
                console.log(e);
            }

            
            return lstPaginacao;
        };
        
        
        /**
         * Função que retorna informações de um determinado deputado.
         *    -- Tenta buscar a informação diretamente da base, caso não tenha, busca do servidor
         *    
         * @param {int} coDeputado   
         * @returns {void}
         */
        this.infoDeputadoLocal = function(coDeputado) 
        {
            try {
                var infoDeputado    = JSON.parse(localStorage.getItem('deputado_'+ coDeputado));

            } catch (e) {console.log(e);}
            
            return infoDeputado;
        };
        
        
        /**
         * Retorna informações que poderão ser uteis no futuro
         * 
         * @returns {undefined}
         */
        this.estatisticaDeputadosBase = function() 
        {
            var lstDeputados = this.listarDeputadosLocal(1, true);
            
            //console.log(lstDeputados);
            
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
         * 
         * @returns {undefined}
         */
        this.listarComissoes = function(coDeputado) 
        {
            var url = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'+ coDeputado+'/orgaos?itens=100&ordem=desc&ordenarPor=dataInicio';

            return $.get(url, {}, function(r) {
                return r;
            }, 'json');
        }
     
     
        /**
         * 
         * @returns {jqXHR}
         */
        this.listarPartidosServidor = function() 
        {
            var url             = 'https://dadosabertos.camara.leg.br/api/v2/partidos?itens=100&ordem=ASC&ordenarPor=sigla';

            return $.get(url, {}, function(r) {
                return r;
            }, 'json');
        };
        
        
        /**
         * 
         * @returns {jqXHR}
         */
        this.infoDetalhadaPartido = function(coPartido) 
        {
            var url             = 'https://dadosabertos.camara.leg.br/api/v2/partidos/'+coPartido;

            return $.get(url, {}, function(r) {
                return r;
            }, 'json');
        };     
     
    }]);
        

