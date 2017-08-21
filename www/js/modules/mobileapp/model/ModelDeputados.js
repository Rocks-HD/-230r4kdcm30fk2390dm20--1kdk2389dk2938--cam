
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
        
