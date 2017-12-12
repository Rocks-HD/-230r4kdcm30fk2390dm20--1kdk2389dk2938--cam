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
        

