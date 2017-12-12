
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
            var lstEstatistica = TGDespesas.listarEstatisticas(coDeputado);
            if (lstEstatistica == null) {
                try {
                    var tpDespesa   = '', 
                        anoMes      = '',
                        lstDespesas = TGDespesas.listarDespesas(coDeputado, 2015, null),
                        result   = {
                            'VGM'    : {}, //ValoresGastosMensais
                            'DGM'    : {}, //DescricaoDosGastosMensais
                            'MB'     : {}, //Maior beneficiário
                            'NCNPJ'  : {}, //Nome do CNPJ
                            'GTA'    : {2015:0, 2016:0, 2017:0, 2018:0},//Gastos Totais Anuais
                            'arrayTpServico' : {}
                        };

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
                        
                        if (typeof result['VGM']['undefined-undefined'] == 'undefined') {
                            TGDespesas.salvarEstatisticas(result, coDeputado);
                        }
                    }
                } catch (e) {console.log(e);}
            } else {
                var result = lstEstatistica;
            }

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
        
