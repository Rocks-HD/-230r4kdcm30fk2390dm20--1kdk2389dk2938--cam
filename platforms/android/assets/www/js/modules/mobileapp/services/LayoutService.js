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
