'use strict';

/**
 * @ngdoc overview
 * @name angularHelloApp
 * @description
 * # angularHelloApp
 *
 * Main module of the application.
 */
angular.module('camara', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'chart.js'
]).config(['$compileProvider', '$sceDelegateProvider', function ($compileProvider, $sceDelegateProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://*.camara.leg.br/**',
        'https://*.camara.leg.br/**',
        'http://www.camara.leg.br/**',
        'https://www.camara.leg.br/**',
        'http://*.webfans.com.br/**',
        'http://webfans.com.br/**',
        'http://host.camaraapp/**']);
}]);
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('LayoutService', ['BaseService', function(BaseService) {
        
        /**
         * Função que retorna o layout do input:select das subcategorias
         * 
         * @param {array} [lstFornecedores]
         * @param {array} [lstFamilias]
         * @return {void}
         */
        this._formSelectFornecedor = function(lstFornecedores, lstFamilias)
        {
            var subCateg = '',
                html =  '<select name="co_categoria" id="co_categoria">'+
                            '<option value="" selected="selected">Escolha um fornecedor</option>';

            for (var coCategoria in lstFornecedores) {
                if (lstFornecedores[coCategoria] != null) {
                    html += '<option value="'+ coCategoria +'">'+ lstFornecedores[coCategoria] +'</option>';
                    subCateg += (function() {
                        var htmlS =  '<select name="co_subcategoria" id="co_subcategoria_'+coCategoria+'">'+
                                        '<option value="" selected="selected">Escolha a subcategoria</option>';

                        for (var sub in lstFamilias[coCategoria]) {
                            if (typeof lstFamilias[coCategoria][sub] !== 'undefined') {
                                htmlS += '<option value="'+ sub +'">'+ lstFamilias[coCategoria][sub]  +'</option>';
                            }
                        }

                        htmlS += '</select>';

                        return htmlS;
                    })();
                }
            }

            html += '</select>';

            $(".areaSelectCategoria").html(html);
            $(".areaSelectSubcategoria").html(subCateg);
        };
    }]);

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

'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGBlocos', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        
     
    }]);
        


'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGDeputados', ['UtilsService', '$http', function(UtilsService, $http) {
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
         * retorna informações de um determinado candidato utilizando o ws-v1
         * 
         * @param {int} coDeputado
         * @returns {jqXHR}
         */
        this.informacaoDeputadoV1 = function(coDeputado) 
        {
            var link = 'http://www.camara.leg.br/SitCamaraWS/Deputados.asmx/ObterDetalhesDeputado';
            
            return $.post(link, {ideCadastro: coDeputado, numLegislatura: ''}, function(r) {
                return r;
            });
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
        
        
        /**
         * 
         * @param int coDeputado
         * @param int pagina
         * @returns {jqXHR}
         */
        this.listarEventos = function(coDeputado, pagina) 
        {
            var url = 'https://dadosabertos.camara.leg.br/api/v2/deputados/'+coDeputado+'/eventos?pagina='+pagina+'&dataInicio=2014-01-01&dataFim=2019-12-31&itens=100&ordem=ASC&ordenarPor=dataInicio"';

            return $.get(url, {}, function(r) {
                return r;
            }, 'json');
        };     
     
    }]);
        


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
        


'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('TGProposicoes', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        
     
        /**
         * Retorna informações das proposições
         * 
         * @param {int} coDeputado
         * @returns {jqXHR}
         */
        this.listarProposicoesCandidato = function(dsNome) 
        {
            var link = 'http://www.camara.leg.br/SitCamaraWS/Proposicoes.asmx/ListarProposicoes',
                data = {parteNomeAutor: dsNome, sigla: '', numero: '', ano : '', datApresentacaoIni: '', datApresentacaoFim: '', idTipoAutor: '', siglaPartidoAutor: '', siglaUFAutor: '', generoAutor: '', codEstado: '', codOrgaoEstado: '', emTramitacao: ''};
            return $.post(link, data, function(r) {
                return r;
            });
        };
    }]);
        


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
        



'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelDeputados', ['UtilsService', 'TGDeputados', function(UtilsService, TGDeputados) {
        
        
        /**
         * Informaçoes detalhadas de um determinado deputado
         * 
         * @param {int} coDeputado
         * @returns {object}
         */
        this.informacaoDoDeputado = function(coDeputado) 
        {
            return TGDeputados.informacaoDoDeputado(coDeputado);
        };
        
        /**
         * Informaçoes detalhadas de um determinado deputado
         * 
         * @param {int} coDeputado
         * @returns {object}
         */
        this.informacaoDoDeputadoV1 = function(coDeputado) 
        {
            var infoDeputado = TGDeputados.informacaoDeputadoV1(coDeputado);

            return $.when(infoDeputado).then(function(r) {
                return $.xml2json(r)['#document']['Deputados']['Deputado'];
            });

        };
        
        /**
         * 
         * @param {int} pagina
         * @param {bool} total
         * @returns {object}
         */
        this.listarDeputadosLocal = function(pagina, total)
        {
            return TGDeputados.listarDeputadosLocal(pagina, total);
        };
        
        
        /**
         * 
         * @param {int} pagina
         * @returns {object}
         */
        this.listarDeputados = function(pagina) 
        {
            return TGDeputados.listarDeputados(pagina);
        };
        
        
        /**
         * @returns {object}
         */
        this.listarPartidos = function() 
        {
            return TGDeputados.listarPartidosLocal();
        };
        
        
        /**
         * Retorna uma lista de dados básicos sobre os partidos políticos que têm ou já tiveram deputados na Câmara. 
         * Se não forem passados parâmetros, o serviço retorna os partidos que têm deputados em exercício no momento da requisição. 
         * É possível obter uma lista de partidos que tiveram deputados em exercício dentro de um intervalo de datas ou de legislaturas 
         * (se um intervalo e uma ou mais legislatura(s) forem passados, todos os intervalos de tempo serão somados). 
         * Também se pode fazer busca por uma ou mais sigla(s), mas atenção: em diferentes legislaturas, 
         * pode haver mais de um partido usando a mesma sigla.
         * 
         * @returns {object}
         */
        this.listarPartidosServidor = function() 
        {
            return TGDeputados.listarPartidosServidor();
        };
        
        
        /**
         * retorn Informações detalhadas sobre um partido
         * 
         * @param {coPartido} coPartido
         * @returns {object}
         */
        this.infoPartido = function(coPartido) 
        {
            return infoDetalhadaPartido(coPartido);
//            https://dadosabertos.camara.leg.br/api/v2/partidos?itens=100&ordem=ASC&ordenarPor=sigla
        };
        
        
        
        /**
         * Retorna uma lista de órgãos, como as comissões e procuradorias, dos quais o deputado identificado por {id} participa ou participou durante um intervalo de tempo.
         * Cada item identifica o órgão, o cargo ocupado pelo parlamentar neste órgão (como presidente, vice-presidente, titular ou suplente) e as datas de início e fim da ocupação deste cargo.
         * Se não for passado algum parâmetro de tempo, são retornados os órgãos ocupados pelo parlamentar no momento da requisição. Neste caso a lista será vazia se o deputado não estiver em exercício.
         * 
         * @returns {object}
         */
        this.listarComissoes = function(coDeputado) 
        {
            
            return TGDeputados.listarComissoes(coDeputado);
        };
        
        
        /**
         * Retorna uma lista de órgãos, como as comissões e procuradorias, dos quais o deputado identificado por {id} participa ou participou durante um intervalo de tempo.
         * Cada item identifica o órgão, o cargo ocupado pelo parlamentar neste órgão (como presidente, vice-presidente, titular ou suplente) e as datas de início e fim da ocupação deste cargo.
         * Se não for passado algum parâmetro de tempo, são retornados os órgãos ocupados pelo parlamentar no momento da requisição. Neste caso a lista será vazia se o deputado não estiver em exercício.
         * 
         * @returns {object}
         */
        this.listarCargos = function(coDeputado) 
        {
            
            return TGDeputados.listarComissoes(coDeputado);
        };

    }]);
        


'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelDespesas', ['UtilsService', 'TGDespesas', 'TGDeputados', function(UtilsService, TGDespesas, TGDeputados) {
        
        
        /**
         * Função que lista as despesas de um determinado candidato
         * 
         * @param {int} coDeputado
         * @param {int} ano
         * @param {int} pagina
         * @returns {object}
         */
        this.listarDespesas = function(coDeputado, ano, pagina) {
            return TGDespesas.listarDespesas(coDeputado, ano, pagina);
        };
        
        
        /**
         * 
         * @param {object} infoDeputado
         * @returns {object}
         */
        this.preencherInfoDeputado = function(infoDeputado) {
            return TGDespesas.preencherInfoDeputado(infoDeputado);
        };
        
        
        /**
         * 
         * @param {int} coDeputado
         * @returns {object}
         */
        this.gerarEstatistica = function(coDeputado) 
        {
            try {
                var tpDespesa   = '', 
                    anoMes      = '',
                    lstDespesas = TGDespesas.listarDespesas(coDeputado),
                    maiorBeneficiario = {},
                    result   = {
                        'VGM'    : {}, //ValoresGastosMensais
                        'DGM'    : {}, //DescricaoDosGastosMensais
                        'MB'     : {}, //Maior beneficiário
                        'NCNPJ'  : {}, //Nome do CNPJ
                        'GTA'    : {2014:0, 2015:0, 2016:0, 2017:0},//Gastos Totais Anuais
                        'arrayTpServico' : {}
                    };

                    
//                console.log(lstDespesas);
                for (var i in lstDespesas) {
                    tpDespesa   = lstDespesas[i]['tipoDespesa'];
                    anoMes      = lstDespesas[i]['ano'] +'-'+ str_pad(lstDespesas[i]['mes'], 2, 0, 'STR_PAD_LEFT');
                    result['arrayTpServico'][tpDespesa] = 1;
                    
                    var valor               = typeof result['VGM'][anoMes] != 'undefined' ? result['VGM'][anoMes] : 0;
                    var valorTpDespesa      = typeof result['DGM'][tpDespesa] != 'undefined' ? result['DGM'][tpDespesa] : 0;
                    var valorBeneficiario   = typeof result['MB'][lstDespesas[i]['cnpjCpfFornecedor']] != 'undefined' ? result['MB'][lstDespesas[i]['cnpjCpfFornecedor']] : 0;

                    result['VGM'][anoMes] = parseFloat(valor) + parseFloat(lstDespesas[i]['valorDocumento']);
                    result['DGM'][tpDespesa] = parseFloat(valorTpDespesa) + parseFloat(lstDespesas[i]['valorDocumento']);
                    result['GTA'][lstDespesas[i]['ano']] += parseFloat(lstDespesas[i]['valorDocumento']);
                    result['MB'][lstDespesas[i]['cnpjCpfFornecedor']] = valorBeneficiario +  parseFloat(lstDespesas[i]['valorDocumento']);
                    result['NCNPJ'][lstDespesas[i]['cnpjCpfFornecedor']] = lstDespesas[i]['nomeFornecedor'];
                }

            } catch (e) {console.log(e);}
            
            return result;
        };
        
        
        /**
         * 
         * @param {int} coDeputado
         * @returns {object}
         */
         this.informacaoDoDeputado = function(coDeputado) {
            return TGDeputados.informacaoDoDeputado(coDeputado);
        };  
    }]);
        


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
        
        
        
    }]);
        



'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.service:BaseService
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .service('ModelProposicoes', ['UtilsService', 'TGProposicoes', function(UtilsService, TGProposicoes) {
        
        
        /**
         * 
         * 
         * @returns {object}
         */
        this.listarProposicoesCandidato = function(dsNome) 
        {
            var lstProposicoes = TGProposicoes.listarProposicoesCandidato(dsNome);

            return $.when(lstProposicoes).then(function(r) {
                return $.xml2json(r)['#document']['proposicoes']['proposicao'];
            });
        };

    }]);
        

'use strict';

/**
 * 73441 - russomanno
 * 178864 - Adail Carneiro
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('CompararController', ['$scope', '$location', '$window', 'ModelDespesas', 'ModelDeputados', 'ModelProposicoes', function CompararController($scope, $location, $window, ModelDespesas, ModelDeputados, ModelProposicoes) {
        $scope.selfUrl = $location.url();
        
        
        $scope.labels1  = ['', ''];
        $scope.data1    = [0, 0];
        $scope.options1 = { title: { display: true, position: 'bottom'}, legend: { display: true } };
        
        $scope.preencherInfoCandidatos = function(info1, det1, prop1, data1, info2, det2, prop2, data2) 
        {
            var infCand1 = typeof info1[0] ? info1[0] : info1,
                infCand2 = typeof info2[0] ? info2[0] : info2;

            
            $(".imgCandidato1").attr('src', det1['0']['ultimoStatus']['urlFoto']);
            $(".nomeCandidato1").html(det1['0']['ultimoStatus']['nomeEleitoral']);
            $(".partidoCandidato1").html(det1['0']['ultimoStatus']['siglaPartido'] +'/'+det1['0']['ultimoStatus']['siglaUf']);
            $(".assiduidade1").html('');
            $(".mandatos1").html(typeof info1[0] ? info1.length : 1);
            $(".proposicoes1").html(prop1.length);
            $(".situacao1").html(typeof info1['situacaoNaLegislaturaAtual'] != 'undefined' ? info1['situacaoNaLegislaturaAtual'] : info1[0]['situacaoNaLegislaturaAtual']);
            $(".escolaridade1").html(det1[0]['escolaridade']);
            $(".qntComissoesTitular1").html('');
            $(".qntCargosOcupados1").html('');

            $(".imgCandidato2").attr('src', det2['0']['ultimoStatus']['urlFoto']);
            $(".nomeCandidato2").html(det2['0']['ultimoStatus']['nomeEleitoral']);
            $(".partidoCandidato2").html(det2['0']['ultimoStatus']['siglaPartido'] +'/'+det1['0']['ultimoStatus']['siglaUf']);
            $(".assiduidade2").html('');
            $(".mandatos2").html(typeof info2[0] ? info1.length : 1);
            $(".proposicoes2").html(prop2.length);
            $(".situacao2").html(typeof info2['situacaoNaLegislaturaAtual'] != 'undefined' ? info2['situacaoNaLegislaturaAtual'] : info2[0]['situacaoNaLegislaturaAtual']);
            $(".escolaridade2").html(det2[0]['escolaridade']);
            $(".qntComissoesTitular2").html('');
            $(".qntCargosOcupados2").html('');

            $scope.preencherGrafico(info1, data1, info2, data2);
        };        
        
        
        $scope.preencherGrafico = function(info1, data1, info2, data2) 
        {
            for (var i in data1['GTA']) { $scope.data1[0] += parseFloat(data1['GTA'][i]); }
            for (var i in data2['GTA']) { $scope.data1[1] += parseFloat(data2['GTA'][i]); }
            
            $scope.labels1[0] = typeof info1[0] != 'undefined' ? info1[0]['nomeParlamentarAtual'] : info1['nomeParlamentarAtual'];
            $scope.labels1[1] = typeof info2[0] != 'undefined' ? info2[0]['nomeParlamentarAtual'] : info2['nomeParlamentarAtual'];            
            $scope.data1[0] = number_format($scope.data1[0], 2, '.', '');
            $scope.data1[1] = number_format($scope.data1[1], 2, '.', '');
        };

        

        
        
        /**
         * Garante que o chart será atualizado quando houver mudança de valores
         */
        $scope.$on('chart-update', function(evt, chart){
            chart.update();
        });          
        
        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            var arrDeputados    = strstr($scope.selfUrl, 'comparar/', false).replace('comparar/', '').split('-'),                
                infoDeputado1   = ModelDeputados.informacaoDoDeputadoV1(arrDeputados[0]),
                infoDeputado2   = ModelDeputados.informacaoDoDeputadoV1(arrDeputados[1]),
                infoDetalhada1  = ModelDeputados.informacaoDoDeputado(arrDeputados[0]),
                infoDetalhada2  = ModelDeputados.informacaoDoDeputado(arrDeputados[1]),
                proposicoes1    = ModelProposicoes.listarProposicoesCandidato(infoDetalhada1['0']['ultimoStatus']['nomeEleitoral']),
                proposicoes2    = ModelProposicoes.listarProposicoesCandidato(infoDetalhada2['0']['ultimoStatus']['nomeEleitoral']),
                despesasDep1    = ModelDespesas.gerarEstatistica(arrDeputados[0]),
                despesasDep2    = ModelDespesas.gerarEstatistica(arrDeputados[1]);
                
            $scope.data1    = [50, 50];    
                
            $.when(infoDeputado1, infoDeputado2, infoDetalhada1, infoDetalhada2, proposicoes1, proposicoes2, despesasDep1, despesasDep2).then(function(inf1, inf2, det1, det2, prop2, prop1, desp1, desp2) {
                $scope.preencherInfoCandidatos(inf1, det1, prop1, desp1, inf2, det2, prop2, desp2);
                
            });
        });     

    }]);
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('DeputadoController', ['$scope', '$location', '$window', 'ModelDespesas', 'ModelDeputados', function DeputadoController($scope, $location, $window, ModelDespesas, ModelDeputados) {
        $scope.selfUrl = $location.url();
        $scope.labels1 = [];
        $scope.data1 = [];
        $scope.options1 = { title: { display: true, position: 'bottom'}, legend: { display: true } };
        
        $scope.labels2 = [];
        $scope.data2 = [];
        $scope.barChartOptions2 = {
            showToolTips: true,
            tooltipEvents: ["mousemove", "touchstart", "touchmove"]
        };


        /**
         * Preenche a tela com informações vindas do servidor
         * 
         * @param {object} infoDeputado
         * @returns {void}
         */
        $scope.preencherInfoDeputado = function(infoDeputado) 
        {
            try {
                $(".nomeDestaque").append(infoDeputado[0]['ultimoStatus']['nomeEleitoral']+' ('+infoDeputado[0]['ultimoStatus']['siglaPartido'] +'-'+infoDeputado[0]['ultimoStatus']['siglaUf']+')' );
                $(".infoNome").append(infoDeputado[0]['nomeCivil']);
                $(".infoNomeEleitoral").append(infoDeputado[0]['ultimoStatus']['nomeEleitoral']);
                $(".infoPartido").append(infoDeputado[0]['ultimoStatus']['siglaPartido'] +'-'+infoDeputado[0]['ultimoStatus']['siglaUf']);
                $(".foto-conheca-seu-deputado").attr('src', infoDeputado[0]['ultimoStatus']['urlFoto']);
                $(".infoNascimento").append(infoDeputado[0]['dataNascimento'].split('-').reverse().join('/'));
                $(".infoTelefone").append(infoDeputado[0]['ultimoStatus']['gabinete']['telefone']);
                $(".infoEmail").append(infoDeputado[0]['ultimoStatus']['gabinete']['email']);
                $(".infoEscolaridade").append(infoDeputado[0]['escolaridade']);
                
            } catch (e) {console.log(e);}
        };


        /**
         * 
         * @param {object} lstComissoes
         * @returns {void}
         */
        $scope.layoutComissoes = function(lstComissoes) 
        {
            var html = '';
            for (var i in lstComissoes) {
                if (typeof lstComissoes[i]['idOrgao'] != 'undefined') {
                    html = '<p>'+ 
                                lstComissoes[i]['nomePapel'] +' - '+ lstComissoes[i]['nomeOrgao'] +'<br />'+
                                lstComissoes[i]['dataInicio'].split('-').reverse().join('/') + (lstComissoes[i]['dataFim'] ? ' - '+ lstComissoes[i]['dataFim'].split('-').reverse().join('/') : '') +
                           '</p><br />';
                   
                    if (lstComissoes[i]['nomePapel'] == 'Titular') {
                        $(".lstTitularComissoes").append(html);
                    } else {
                        $(".lstSuplenteComissoes").append(html);
                    }
                }
            }
        };
        
        
        /**
         * PF;PJ que mais recebeu pagamento do deputado
         * 
         * @param {array} data
         * @returns {void}
         */
        $scope.layoutBeneficiarios = function(data) 
        {
            var nomesBeneficiarios  = data['NCNPJ'];
            var maiorBeneficiario   = data['MB'];
            var maiorBenefOrd       = Object.values(maiorBeneficiario).sort(function(a,b) { return a - b;}).reverse();
            var contador            = 0;
            var somatorio           = 0;
            
            for (var i in maiorBenefOrd) {
                if (contador++ <= 10) {
                    var key  = $.inArray(maiorBenefOrd[i], Object.values(maiorBeneficiario)),
                        cnpj = Object.keys(maiorBeneficiario)[key];
                
                    $(".maioresBeneficiarios").append('<p>'+
                                                        nomesBeneficiarios[ cnpj ] +'<br />'+
                                                        'R$ '+ number_format(maiorBenefOrd[i], 2, ',', '.')+
                                                      '</p><br />');
                }
                somatorio += maiorBenefOrd[i];
            }
            
            $(".valorTotal").append('TOTAL R$ '+ number_format(somatorio, 2, ',', '.'));
        };


        /**
         * 
         * @returns {undefined}
         */
        $scope.infoRelatorioDespesas = function () 
        {
            var coDeputado    = strstr($scope.selfUrl, '/', false).replace( /^\D+/g, ''),
                infoRelatorio = ModelDespesas.gerarEstatistica(coDeputado);
             
            for (var i in infoRelatorio['DGM']) {
               $scope.labels1.push(i);
               $scope.data1.push(number_format(infoRelatorio['DGM'][i], 2, '.', ''));
            }
            
            for (var i in infoRelatorio['VGM']) {
               $scope.labels2.push(i);
               $scope.data2.push(number_format(infoRelatorio['VGM'][i], 2, '.', ''));
            }

            $scope.layoutBeneficiarios(infoRelatorio);

            return JSON.stringify( infoRelatorio );
        };


        /**
         * Função que inicia a tela
         * 
         * @returns {void}
         */
        $scope._init = function() 
        {
            try {
                var coDeputado   = strstr($scope.selfUrl, '/', false).replace( /^\D+/g, ''),
                    infoDeputado = ModelDeputados.informacaoDoDeputado(coDeputado);
                    
                    
                ModelDespesas.listarDespesas(coDeputado, 2014, 1);
                $scope.preencherInfoDeputado(infoDeputado);
                
                var lstComissoes = ModelDeputados.listarComissoes(coDeputado);
                $.when(lstComissoes).then(function(r) {
                    $scope.layoutComissoes(r['dados']);
                });
                
                var lstCargos = ModelDeputados.listarCargos(coDeputado);
                $.when(lstCargos).then(function(r) {
                    $scope.layoutComissoes(r['dados']);
                });
                
            } catch (e) {console.log(e);}
        };


        /**
         * INIT: 
         */
        angular.element(document).ready(function() 
        {
            $scope.infoRelatorioDespesas();
            $scope._init();
        });

    }]);
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('HomeController', ['$scope', '$location', 'ModelDeputados', 'ModelGeral', function ($scope, $location, ModelDeputados, ModelGeral) {
        $scope.APPLICATION_ENV  = ModelDeputados.APPLICATION_ENV;
        $scope.url              = ModelDeputados.url;  
        $scope.options;
        $scope.msgPainel;
        $scope.filter           = {'ds_nome' : '', 'ds_estado' : '', 'ds_partido' : ''};
        $scope.imgSelecionar    = '/js/modules/mobileapp/layouts/imagens/background/background-deputado.svg';
        $scope.dpSelecionado1   = 0;
        $scope.dpSelecionado2   = 0;


        /**
         * insere a lista de deputados
         * @param {type} data
         * @param {type} clear
         * @returns {undefined}
         */
        $scope.listaDeputados = function(data, clear) 
        {        
            try {
                if (clear === true) {$(".div-interna").html('');}

                if (typeof data['dados'] != 'undefined') {
                    for (var i in data['dados']) {$(".div-interna").append($scope.layoutItemDeputado(data['dados'][i]));}
                } else {
                    for (var i in data) {
                        var dsNome      = $scope.filter['ds_nome'] ? $scope.filter['ds_nome'].toUpperCase() : '';
                        var filtroTotal = (dsNome == '' || removerAcento(data[i]['nome']).search(removerAcento(dsNome)) !== -1) && 
                                          ($scope.filter['ds_estado'] == '' || $scope.filter['ds_estado'] == data[i]['siglaUf']) && 
                                          ($scope.filter['ds_partido'] == '' || $scope.filter['ds_partido'] == data[i]['siglaPartido']);

                        if (filtroTotal == true) {
                            $(".div-interna").append($scope.layoutItemDeputado(data[i]));
                        }
                    }
                }

                $(".div-interna").css('width', ((typeof data.length != 'undefined' && data.length != 0 ? data.length : 100)*100) +'px');
            } catch (e) {}

        };
        
        /**
         * Layout para preenchimento
         * 
         * @param {type} data
         * @returns {String}
         */
        $scope.layoutItemDeputado = function(data) 
        {
            var html = '<div class="box-deputado" data-id="'+ data['id'] +'">'+
                            '<img src="'+ data['urlFoto'] +'" alt="'+ data['nome'] +'"/>'+
                            '<h3>'+ data['nome'] +'</h3>'+
                            '<h4>'+ data['siglaUf'] +'/'+ data['siglaPartido'] +'</h4>'+
                        '</div>';
            return html;
        };
        
        
        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.listarEstados = function() 
        {
            var lstEstados = ModelGeral.listarEstadosLocal();
            
            for (var i in lstEstados) {
                $("#ds_estado").append('<option value="'+ i +'">'+ i +'</option>');
            }
        };


        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.listarPartidos = function() 
        {
            var lstPartidos = ModelDeputados.listarPartidos();
            
            for (var i in lstPartidos) {
                $("#ds_partido").append('<option value="'+ i +'">'+ i +'</option>');
            }
        };

        
        $scope.preencherInfoDeputado = function(infoDeputado) 
        {
            $(".infoNascimento").append(infoDeputado[0]['dataNascimento'].split('-').reverse().join('/'));
            $(".infoTelefone").append(infoDeputado[0]['dataNascimento']);
            $(".infoEmail").append(infoDeputado[0]['ultimoStatus']['gabinete']['email']);
            $(".infoEscolaridade").append(infoDeputado[0]['escolaridade']);
        };
        
        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
//            $location.path('#/'+target);  
            window.location.hash = target;
        };
        
        
        
        $(document).on("click", "#btn-menu", function () {
            $(".menu-principal").slideToggle();
            $("header #btn-menu span").toggleClass("muda-cor-btn-menu");
        });
        $(document).on('click', ".menu-principal a", function() {
            $(".menu-principal").hide();
            return false;
        });
        
        
        /**
         * Quando o usuário clicar em qualquer botão padrão do sistema que envie o formulário
         */
        $(document).on("click", "#btnEnviar", function() {

        });

        
        

        
        
        
        /**
         * ON: Verifica se o usuário selecionou algum estado
         */
        $(document).on("change", "#ds_estado", function() {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_estado'] = $("#ds_estado").val();
            $scope.listaDeputados(lstDeputados, true);            
        });
        
        /**
         * ON: Verifica se o usuário selecionou algum partido
         */
        $(document).on("change", "#ds_partido", function() {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            $scope.filter['ds_partido'] = $("#ds_partido").val();
            $scope.listaDeputados(lstDeputados, true);            
        });


        /**
         * ON: Executa ação quando um deputado for selecionado, seleção p/ comparação ou removido
         */
        var DELAY = 500, clicks = 0, timer = null;
        $(document).on("click", ".box-deputado", function() {
            var coDeputado  = $(this).attr('data-id'),
                self        = this;
            clicks++; 
            
            if (clicks === 1) {
                timer = setTimeout(function() {
                    var infoSelecionado = $(self).html(),
                        coDeputado      = $(self).attr('data-id');

                    if ($("#deputadoSelecionado1 img").attr('src') == $scope.imgSelecionar && $scope.dpSelecionado2 != coDeputado ) {
                        $("#deputadoSelecionado1").html(infoSelecionado);
                        $scope.dpSelecionado1 = coDeputado;
                    } else if ($("#deputadoSelecionado2 img").attr('src') == $scope.imgSelecionar && $scope.dpSelecionado1 != coDeputado ) {
                        $("#deputadoSelecionado2").html(infoSelecionado);
                        $scope.dpSelecionado2 = coDeputado;
                    }
                    clicks = 0;
                    
                }, DELAY);
            } else {
                clearTimeout(timer);  
                $scope.redirecionar('conheca/'+coDeputado);
                ModelDeputados.informacaoDoDeputado(coDeputado);
                clicks = 0;   
            }
            
        }).on("click", "#deputadoSelecionado1, #deputadoSelecionado2", function() {
            $(this).html('<img src="'+ $scope.imgSelecionar +'">');
            
        });



        /**
         * ON: verifica se o usuário esta digitando alguma palavra
         */
        $(document).on("keyup", "#ds_nome", function() {
            var lstDeputados = ModelDeputados.listarDeputadosLocal(1, true);
            
            console.log(lstDeputados)
            
            $scope.filter['ds_nome'] = $("#ds_nome").val();
            $scope.listaDeputados(lstDeputados, true);
        });


        window.onhashchange = function() {
            window.location.reload();
        };

        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            var selfUrl = $location.url();
            if (selfUrl == '' || selfUrl == '/') {
                var lstDeputados = ModelDeputados.listarDeputados(1);

                $.when(lstDeputados).then(function(r) {
                    $scope.listaDeputados(r, false);
                    $scope.listarEstados();
                    $scope.listarPartidos();
                });
            }
        });

    }]);

'use strict';
/**
 * @ngdoc overview
 * @name angularHelloApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('camara')


// configure views; whenAuthenticated adds a resolve method to ensure users authenticate
// before trying to access that route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/home.html',
            controller: 'HomeController'
        }).when('/opiniao', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/opiniao.html',
            controller: 'OpiniaoController'
        }).when('/ranking', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/ranking.html',
            controller: 'HomeController'
        }).when('/conheca/:item', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/conheca.html',
            controller: 'DeputadoController'
        }).when('/comparar/:item', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/comparar.html',
            controller: 'CompararController'
        }).when('/abertura', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/abertura.html',
            controller: 'HomeController'
        }).when('/creditos', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/creditos.html',
            controller: 'HomeController'
        })
        //.otherwise({redirectTo: '/'});
        ;
}]);
