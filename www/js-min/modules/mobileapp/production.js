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
    'ngSanitize'
]).config(['$compileProvider', '$sceDelegateProvider', function ($compileProvider, $sceDelegateProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file):/);

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
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
    .service('BaseService', ['UtilsService', function(UtilsService) {
        var selfTarget          = document.URL;
        this.APPLICATION_ENV    = selfTarget.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
        this.url                = this.APPLICATION_ENV == 'development' ? 'http://host.camaraapp' : 'http://webfans.com.br';  
        this.login              = this.url+'/mobile/';  
        this.urlMercados        = this.url+'/mobile/index/listar-mercados';
        this.upload             = this.url+'/mobile/visita/cadastrar';        
        this.urlCheckin         = this.url+'/mobile/index/checkin';        
        this.urlCheckout        = this.url+'/mobile/index/checkout';        
        this.nuPendencias       = 0;
        this.identity           = {coFilial : 2, coFuncionario : 1, latLong: UtilsService._getLatLong()};
        
        /**
         * Lista os as pendências existentes no celular do usuário
         * 
         * @returns {object}
         */
        this.listarBase = function() 
        {
            var pendencias = {};
            
            for (var i in localStorage) {
                if (i != 'coFuncionario') {//Orgão é um item da base
                   pendencias[i] = JSON.parse(localStorage[i]);
                }
            }
            
            return pendencias;
        };       
        
        
        /**
         * Esta função somente será chamada quando não houve conexão com a internet
         * ou se houver problemas no envio da mensagem
         * 
         * @returns {void}
         */
        this.salvarBase = function(options) 
        {
            if(typeof(Storage) !== "undefined") {
                localStorage.setItem(UtilsService._random(), JSON.stringify(options));
                window.location.hash = '/';
                
            } else {
                alert('Não foi possível enviar e nem salvar as informações, verifique a conexão com a internet e tente novamente.');
            }  
        };

        
        /**
         * Grava em uma variável globa o número de itens pendentes no celular do usuário
         * 
         * @returns {void}
         */
        this.contarBase = function() 
        {
            this.nuPendencias = 0;
            
            if(typeof(Storage) !== "undefined") {
                for (var i in localStorage) {
                    if (i != 'coFuncionario') {
                        ++this.nuPendencias;
                    }
                }
            }
            
            return this.nuPendencias;
        };
        
        
        /**
         * Remove um determinado item da base de dados do usuário
         * 
         * @param int key
         * @returns {void}
         */
        this.removerItemBase = function(key) 
        {
            if (confirm('Deseja realmente excluir esta informação?')) {
                localStorage.removeItem(key);
            }
        };
        
        
        /**
         * Função que salva as informações do funcionário
         * 
         * @returns {void}
         */
        this.salvarIdentificacao = function(orgOrigem) 
        {
            localStorage.setItem('coFuncionario', orgOrigem);
            window.location.hash = '/';
        };        
        
        
        /**
         * Garante que a variável orgOrigem estará preenchida com as informações do orgão de origem
         * 
         * @returns {string}
         */
        this.recuperarIdentificacao = function() 
        {
            this.identity.coFuncionario = localStorage.getItem('co_funcionario');

            return this.identity.coFuncionario;
        };
        
        
        /**
         * Esta função garantirá que o usuário não cadastrará novamente o mesmo produto
         *   -- Esta função deverá ser desabilitada caso o usuário tenha interesse em reenviar as informações
         *  
         * @param int coProduto
         * @param object data
         * @returns {undefined}
         */
        this.cadastrarItensVisitados = function(data) 
        {   
            var dtVisita            = UtilsService._dataAtualVisita(),
                getVisitaItens      = JSON.parse(localStorage.getItem('visita_'+ dtVisita)),
                lstItensVisitados   = (getVisitaItens != null ? getVisitaItens : new Array());
            
            if (data != null) {
                lstItensVisitados.push(data);
                localStorage.setItem('visita_'+ dtVisita, JSON.stringify(lstItensVisitados));

            } else {
                return lstItensVisitados;
            }
        };
        
        
        /**
         * Vai até o servidor e lista os mercados existentes
         * get
         * @returns {void}
         */
        this.manterMercados = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();    
        
            $.post(this.urlMercados, {}, function(r) {
                localStorage.setItem('mercados_'+ dtVisita, JSON.stringify(r));
            });
        };
        
        
        /**
         * Recupera as informações de mercado da base de dados...
         * 
         * @returns array
         */
        this.listarMercados = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('mercados_'+ dtVisita));
        };
        
        
        
        /**
         * Salva as informações iniciais do aplicativo. 
         *   -- Informações mais importantes para o sistema.
         *   
         * @param {type} r
         * @returns {undefined}
         */
        this.salvarInfoLogin = function(r) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
        
            localStorage.setItem('identity_'+ dtVisita, JSON.stringify(r.identity));
            localStorage.setItem('lstRelacao_'+ dtVisita, JSON.stringify(r.lstRelacao));
            localStorage.setItem('lstSimilares_'+ dtVisita, JSON.stringify(r.lstSimilares));
            localStorage.setItem('msgPainel_'+ dtVisita, JSON.stringify(r.msgPainel));
        };  
        
        
        /**
         * Recupera um array de informações que são necessárias para o gerenciamento do sistema
         * 
         * @returns {object}
         */
        this.getSimilares = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita));
        };
        
        
        /**
         * Adiciona informações no campo de similares
         *   -- Array multidimensional contendo 
         *      * Fornecedor
         *      * familia
         *      * similares
         *      * concorrentes
         * @returns {void}
         */
        this.setSimilares = function(data) 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            localStorage.setItem('lstSimilares_'+ dtVisita, JSON.stringify(data));
        };
        
        
        /**
         * Retorna as informações básicas da identidade do usuário
         * 
         * @returns {Array|Object}
         */
        this.getIdentity = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('identity_'+ dtVisita));
        };
        
        /**
         * Retorna as categorias existentes na base de dados para o usuário específico
         * 
         * @returns {Array|Object}
         */
        this.getLstRelacao = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('lstRelacao_'+ dtVisita));
        };
        
        
        /**
         * Retorna um array multidimensional de fornecedores/familia/similares/produtos
         * 
         * @returns {Array|Object}
         */
        this.getLstSimilares = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita));
        };
        
        
        /**
         * Retorna a lista de fornecedores
         * 
         * @returns {Array|Object}
         */
        this.getFornecedores = function() 
        {
            var dtVisita    = UtilsService._dataAtualVisita(),
                similares   = JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita)),
                result      = {};
        
            if (similares != null && typeof similares['fornecedor'] != undefined) {
                result = similares['fornecedor'];
            }
            
            return result;
        };        
        
        
        /**
         * Retorna a lista de família de fornecedores por coFornecedor
         * 
         * @returns {Array|Object}
         */
        this.getFamilia = function() 
        {
            var dtVisita    = UtilsService._dataAtualVisita(),
                similares   = JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita)),
                result      = {};
        
            if (similares != null && typeof similares['familia'] != undefined) {
                result = similares['familia'];
            }
            
            return result;
        };        
        
        
        /**
         * Retorna a lista de categorias similares por coFamilia
         * 
         * @returns {Array|Object}
         */
        this.getCatSimilares = function() 
        {
            var dtVisita    = UtilsService._dataAtualVisita(),
                similares   = JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita)),
                result      = {};
        
            if (similares != null && typeof similares['similares'] != undefined) {
                result = similares['similares'];
            }
            
            return result;
        };        
        
        
        /**
         * Retorna a lista de produtos por coSimilar
         * 
         * @returns {Array|Object}
         */
        this.getProdutos = function() 
        {
            var dtVisita    = UtilsService._dataAtualVisita(),
                similares   = JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita)),
                result      = {};
        
            if (similares != null && typeof similares['produtos'] != undefined) {
                result = similares['produtos'];
            }
            
            return result;
        };        
        
        
        /**
         * Retorna a lista de concorrentes por coSimilar
         * 
         * @returns {Array|Object}
         */
        this.getConcorrentes = function() 
        {
            var dtVisita    = UtilsService._dataAtualVisita(),
                similares   = JSON.parse(localStorage.getItem('lstSimilares_'+ dtVisita)),
                result      = {};
        
            if (similares != null && typeof similares['concorrentes'] != undefined) {
                result = similares['concorrentes'];
            }
            
            return result;
        };        
        
        
        /**
         * Retorna a mensagem que será exibida após o login
         * 
         * @returns {Array|Object}
         */
        this.getMsgPainel = function() 
        {
            var dtVisita = UtilsService._dataAtualVisita();
            return JSON.parse(localStorage.getItem('msgPainel_'+ dtVisita));
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
    .service('ImagemService', ['BaseService', function(BaseService) {
        this.APPLICATION_ENV = BaseService.APPLICATION_ENV;
        
        
        /**
         * Função que abre a camera para que o usuário possa fotografar o local
         * 
         * @returns {void}
         */
        this.capturarFoto = function() 
        {
            try {
                navigator.camera.getPicture(function(imageURI) {
                    var html = '';

                    html += '<tr>'+
                                '<td><img src="'+ imageURI +'" alt="" class="fotoLocal foto-local lista-fotos"/></td>'+
                                '<td><img class="btnRemoverImagem" src="./js/modules/mobileapp/layouts/imagens/icones/ico-lixeira.svg" alt="" /></td>'+
                            '</tr>';
                    $(".tbl-lst-fotos").html(html);

                }, function(message) {
                    //alert('Failed because: ' + message);

                }, {
                    quality: 20,
                    destinationType: Camera.DestinationType.FILE_URI,
                    correctOrientation: true
                });     
            } catch (e) {
                console.log(e);
            }
        };
        
        
        /**
         * Função que abre a camera para que o usuário possa fotografar o local
         * 
         * @returns {void}
         */
        this.recuperarFoto = function() 
        {
            try {            
                var html    = '';
                
                navigator.camera.getPicture(function(imageURI) {    
                    window.resolveLocalFileSystemURL(imageURI, function(entry){
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
                        function(fileSys) { 
                            fileSys.root.getDirectory("camara", {create: true, 
                                                                 exclusive: false}, 
                            function(directory) { 
                                entry.copyTo(directory, UtilsService._random()+".jpg", function(file) {
                                    html += '<tr>'+
                                                '<td><img src="'+ file.nativeURL +'" alt="" class="foto-local lista-fotos"/></td>'+
                                                '<td><img class="btnRemoverImagem" src="./js/modules/mobileapp/layouts/imagens/svg/ico-lixeira.svg" alt="" /></td>'+
                                            '</tr>';
                                    $(".tbl-lst-fotos").html(html);
                                    
                                }, function() {}); 
                            }, function() {}); 
                        }, function() {}); 
                    }, function() {
                        html += '<tr>'+
                                    '<td><img src="'+ imageURI +'" alt="" class="foto-local lista-fotos"/></td>'+
                                    '<td><img class="btnRemoverImagem" src="./js/modules/mobileapp/layouts/imagens/svg/ico-lixeira.svg" alt="" /></td>'+
                                '</tr>';
                        $(".tbl-lst-fotos").html(html);
                    });
                }, function(message) {
                    //-- alert('Failed because: ' + message);
                }, {
                    quality: 30,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    saveToPhotoAlbum: false,
                });
            } catch (e) {
                console.log(e);
            }                
        };  
        
        
        /**
         * Garantir que a imagem estará disponível mesmo após o fechamento da aplicação
         *   -- Cache estático da aplicação...
         * 
         * @param {string} fileUri
         * @returns {string}
         */
        this.removerImagem = function() 
        {
            try {
                //Remove a foto da lista de imagens a serem enviadas
                $(".tbl-lst-fotos").html(
                        '<tr>'+
                            '<td><div class="alert alert-warning">Você ainda não indexou nenhuma foto! Clique no botão abaixo para tirar uma foto do local</div></td>'+
                        '</tr>');

                //Garante que a imagem não estará mais disponível no celular.
                navigator.camera.cleanup(function() {
                    console.log('Arquivo removido do servidor');
                }, function() {
                    console.log('Erro ao remover a imagem: ' + message);
                });
            } catch (e) {
                console.log(e);
            }
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
        
        

        /**
         * Função que retorna o layout de produtos.
         *
         * @param {array} [lstSimilares]
         * @param {array} [lstProdutos]
         * @param {array} [lstConcorrentes]
         * @param {int} [coSubcategoria]
         * @param {string} [urlUpload]
         * @param {int} [coFuncionario]
         * @param {int} [coFilial]
         * @param {string} [latLong]
         * @returns {string}
         */
        this._layoutSimilares = function(lstSimilares, lstProdutos, lstConcorrentes, coSubcategoria, urlUpload, coFuncionario, coFilial, latLong)
        {           
            var html = '';
            
            for (var l in lstSimilares) {
                var coSimilar = l,
                    noSimilar = lstSimilares[l];
                
                html +=  
                        '<form action="'+ urlUpload +'" method="post" name="formSalvarVisita" id="formSalvarVisita'+ coSimilar +'" >'+
                            '<div class="msgSystemAlert msgSystemAlert'+ coSimilar +' collapse" style="margin-left: -5px; margin-right: -5px; margin-top: 15px;"></div>'+
                            '<input type="hidden" name="co_funcionario" id="co_funcionario'+ coSimilar +'" value="'+ coFuncionario +'">'+
                            '<input type="hidden" name="co_filial_mercado" id="co_filial_mercado'+ coSimilar +'" value="'+ coFilial +'">'+
                            '<input type="hidden" name="co_similar" id="co_similar'+ coSimilar +'" value="'+ coSimilar +'">'+
                            '<input type="hidden" name="ds_latlong" id="ds_latlong'+ coSimilar +'" value="'+ latLong +'">'+
                            '<input type="hidden" name="st_disponibilidade" id="st_disponibilidade'+ coSimilar +'" value="">'+
                            '<div class="item-produto">'+
                                '<div class="row lista-produtos margin-top-30">'+
                                    '<div class="col-xs-2">'+
                                        '<img src="./js/modules/mobileapp/layouts/imagens/icones/ico-bola.svg" alt="fornecedor">'+
                                    '</div>'+
                                    '<div class="col-xs-8">'+
                                        '<h4>'+ noSimilar +'</h4>'+
                                    '</div>'+
                                    '<div class="col-xs-2 text-right">'+
                                        '<span class="glyphicon glyphicon-heart-empty icoEnviar" data-id="'+ coSimilar +'" ></span>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row detalhes-produto">'+
                                    '<div class="col-xs-10 col-xs-offset-2">'+
                                        '<p class="tem-o-produto">Tem o produto?'+
                                            '<span class="glyphicon glyphicon-ok-circle float-right margin-left-20 opacity-menor btnSim"></span>'+
                                            '<span class="glyphicon glyphicon-remove-circle float-right opacity-menor btnNao"></span>'+
                                        '</p>'+
                                        '<div class="confirmarFaltaProduto hidden">'+
                                            '<input type="text" value="" name="ds_confirmar_falta" id="ds_confirmar_falta'+ coSimilar +'" placeholder="Digite: \'em falta\'">'+
                                        '</div>'+

                                        '<div class="mostra-detalhes-produtos hidden">'+
                                            '<div class="pdv-similares">'+
                                                '<p class="tem-similares">PRODUTO SIMILAR?'+
                                                    '<span class="glyphicon glyphicon-ok-circle float-right margin-left-20 opacity-menor btnSim"></span>'+
                                                    '<span class="glyphicon glyphicon-remove-circle float-right opacity-menor btnNao"></span>'+
                                                '</p>'+
                                            '</div>'+
                                            '<div class="pdv-similares-result hidden">'+
                                                '<input type="hidden" name="lst_produtos_existentes" id="lst_produtos_existentes'+ coSimilar +'" />';
                                    
                                                for (var i in lstProdutos[coSimilar]) {
                                                    html += '<p class="item-produto-similar">'+ lstProdutos[coSimilar][i] +
                                                                '<span class="glyphicon glyphicon-ok-circle float-right margin-left-20 opacity-menor btnSim" id="'+ coSimilar +'produto'+ i +'"></span>'+
                                                            '</p>';
                                                };

                html += 
                                            '</div>'+
                                            

                                            '<div class="preco">'+
                                                '<div class="preco-detalhes">'+
                                                    '<p>preço<span class="glyphicon glyphicon-menu-right float-right"></span></p>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="preco-result hidden">'+
                                                '<input type="text" placeholder="Meu preço" name="vl_meu_preco" id="vl_meu_preco'+ coSimilar +'">';

                                                for (var i in lstConcorrentes[coSimilar]) {
                                                    html += '<input type="text" placeholder="Preço '+ lstConcorrentes[coSimilar][i] +'" name="vl_preco_concorrente'+ i +'" id="vl_preco_concorrente'+ i +'">';
                                                };
                html += 
                                                '<div class="text-center fieldBtnAddConcorrente'+coSimilar+'"><button type="button" class="btn btn-default btn-xs" data-toggle="collapse" data-target=".areaAddConcorrente'+ coSimilar +'"><i class="glyphicon glyphicon-certificate icoEnviar" data-id="'+ coSimilar +'"></i> Add Concorrente</button></div>'+
                                                '<div class="areaFormConcorrente jumbotron areaAddConcorrente'+coSimilar+' collapse" data-url="'+ BaseService.url+'/mobile/visita/cadastrar-concorrente">'+
                                                    '<input type="text" class="noConcorrente" placeholder="Informe o nome do produto concorrente" name="no_concorrente" id="no_concorrente'+coSimilar+'">'+
                                                    '<button type="button" class="btn btn-danger btn-xs" data-toggle="collapse" data-target=".areaAddConcorrente'+ coSimilar +'">Cancelar</button> '+
                                                    '<button type="button" class="btn btn-primary btn-xs btnSalvarConcorrente" data-id="'+ coSimilar +'">Salvar concorrente</button>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</form>';
            }
            
            html +=     '<br /><hr /><br />'+
                        '<form action="'+ urlUpload +'-familia" method="post" name="formSalvarVisitaFamilia" id="formSalvarVisitaFamilia'+ coSubcategoria +'" >'+
                            '<div class="msgSystemAlert msgSystemAlert'+ coSubcategoria +' collapse" style="margin-left: -5px; margin-right: -5px;"></div>'+
                            '<input type="hidden" name="co_funcionario" id="co_funcionario'+ coSubcategoria +'" value="'+ coFuncionario +'">'+
                            '<input type="hidden" name="co_filial_mercado" id="co_filial_mercado'+ coSubcategoria +'" value="'+ coFilial +'">'+
                            '<input type="hidden" name="co_familia" id="co_familia'+ coSubcategoria +'" value="'+ coSubcategoria +'">'+
                            '<input type="hidden" name="ds_latlong" id="ds_latlong'+ coSubcategoria +'" value="'+ latLong +'">'+
                            '<div class="item-produto">'+
                                '<div class="container">'+
                                    '<div class="row detalhes-produto">'+
                                        '<div class="mostra-detalhes-produtos">'+
                                    
                                            '<div class="pdv">'+
                                                '<div class="pdv-detalhes">'+
                                                    '<p>pdv<span class="glyphicon glyphicon-menu-right float-right"></span></p>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="pdv-result hidden">'+
                                                '<input type="text" placeholder="Total de gôndolas" value="" name="tt_gondolas" id="tt_gondolas'+ coSubcategoria +'">'+
                                                '<input type="text" placeholder="Tamanho de gôndolas" value="" name="tm_gondolas" id="tm_gondolas'+ coSubcategoria +'">'+
                                                '<input type="text" placeholder="Tamanho de frente" value="" name="tt_frente" id="tt_frente'+ coSubcategoria +'">'+
                                            '</div>'+

                                            '<div class="foto">'+
                                                '<div class="foto-detalhes">'+
                                                    '<p>foto<span class="glyphicon glyphicon-menu-right float-right"></span></p>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="foto-result hidden">'+
                                                '<div class="foto-tirada">'+
                                                    '<table class="table table-striped table-bordered tbl-lst-fotos">'+
                                                        '<tr>'+
                                                            '<td><img src="./js/modules/mobileapp/layouts/imagens/fotos/foto1.jpg" alt="" class="fotoLocal foto-local'+ coSubcategoria +'"></td>'+
                                                        '</tr>'+
                                                    '</table>'+
                                                '</div>'+
                                                '<div class="icone-maquina-fotografica">'+
                                                    '<p>Clique no ícone para tirar/substituir uma foto</p>'+
                                                    '<img src="./js/modules/mobileapp/layouts/imagens/icones/ico-fotografia.svg" alt="maquina-fotografica" class="imgPhotoClick">'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="pontoExtra">'+
                                                '<div class="pontoExtra-detalhes">'+
                                                    '<p>tem ponto extra?<span class="glyphicon glyphicon-menu-right float-right"></span></p>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="pontoExtra-result hidden">'+
                                                '<span class="sim-extra">SIM <span class="glyphicon glyphicon-ok"></span></span>'+
                                                '<span class="margin-left-20"></span>'+
                                                '<span class="nao-extra">NÃO <span class="glyphicon glyphicon-remove"></span></span>'+
                                                '<input type="hidden" name="st_ponto_extra" id="st_ponto_extra'+ coSubcategoria +'" value="">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</form>'+
                        '<div class="text-center">'+
                            '<button class="margin-top-30 btn-goiaba btnSalvarFamilia btnSalvarFamilia'+coSubcategoria+'" data-id="'+ coSubcategoria +'" data-loading-text="Enviando...">Salvar Família</button>'+
                        '</div>';
                
            return html;
        };
       
        
        /**
         * Padrão de ações quando um conteúdo é enviado para o servidor.
         * 
         * @param {object} r
         * @param {int} coSimilar
         * @param {object} options
         * @returns {void}
         */
        this._padraoSalvarSimilar = function(r, coSimilar, options) 
        {
            $(".btn-ok, .btnSalvarFamilia").button('reset');
            if (r.type == 'success') {
                BaseService.cadastrarItensVisitados(options);
                $("#formSalvarVisita"+coSimilar+" .glyphicon-heart-empty").removeClass('glyphicon-heart-empty icoEnviar').addClass('glyphicon-heart')
                $("#formSalvarVisita"+coSimilar+" .msgSystemAlert"+coSimilar).removeClass('in');
                $("#formSalvarVisita"+coSimilar+" .mostra-detalhes-produtos").find('input').attr('readonly', 'readonly');
                $("#formSalvarVisita"+coSimilar+" .pdv-similares-result, #formSalvarVisita"+coSimilar+" .preco-result").addClass('hidden');
            } else {
                $("#formSalvarVisita"+coSimilar+" .msgSystemAlert"+coSimilar).addClass('in').css("height", "auto").html('<div class="alert alert-danger"><button type="button" data-toggle="collapse" data-target=".msgSystemAlert'+ coSimilar +'" class="close">&times;</button><p></p>'+ r.flashMsg +'</div>');
            }      
        };
       
        
        /**
         * Padrão de ações quando um conteúdo é enviado para o servidor.
         * 
         * @param {object} r
         * @param {int} coFamilia
         * @param {object} options
         * @returns {void}
         */
        this._padraoSalvarFamilia = function(r, coFamilia, options) 
        {
            var resp = JSON.parse(r.response);
            
            if (resp.type == 'success') {
                BaseService.cadastrarItensVisitados(options);
                $("#formSalvarVisitaFamilia"+coFamilia+" .msgSystemAlert"+coFamilia).removeClass('in');
                $("#formSalvarVisitaFamilia"+coFamilia+" .msgSystemAlert"+coFamilia).addClass('in').css("height", "auto").html('<div class="alert alert-success"><button type="button" data-toggle="collapse" data-target=".msgSystemAlert'+ coFamilia +'" class="close">&times;</button><p></p>'+ resp.flashMsg +'</div>');
                $(".btnSalvarFamilia").html('Família concluída');
            } else {
                $(".btn-ok, .btnSalvarFamilia").button('reset');
                $("#formSalvarVisitaFamilia"+coFamilia+" .msgSystemAlert"+coFamilia).addClass('in').css("height", "auto").html('<div class="alert alert-danger"><button type="button" data-toggle="collapse" data-target=".msgSystemAlert'+ coFamilia +'" class="close">&times;</button><p></p>'+ resp.flashMsg +'</div>');
            }         
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
        
        
        this._dataAtualVisita = function() 
        {
            var data    = new Date();
            var dia     = (data.getDate().toString().length == 1) ? '0'+data.getDate() : data.getDate();
            var mes     = (data.getMonth().toString().length == 1) ? '0'+(data.getMonth()+1) : (data.getMonth()+1);
            var ano     = data.getFullYear();

            return ano+""+mes+""+dia;
        };
});

'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description Aplicativo de denúncia de invasão de areas públicas.
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('HomeController', ['$scope', '$location', '$window', 'BaseService', function($scope, $location, $window, BaseService) {
        $scope.APPLICATION_ENV  = BaseService.APPLICATION_ENV;
        $scope.url              = BaseService.url;  
        $scope.login            = BaseService.login;  
        $scope.upload           = BaseService.upload;
        $scope.options;
        $scope.mercados;
        $scope.msgPainel;
        
        //Itens necessários para o projeto de visita. Ativados pela função "angular.element(document).ready"
        $scope.identity         = BaseService.identity;
        $scope.lstRelacao       = {};
        $scope.lstFornecedores  = {};
        $scope.lstFamilias      = {};
        $scope.lstSimilares     = {};
        $scope.lstConcorrentes  = {};
        $scope.lstProdutos      = {};

        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
            $location.path('/'+target);  
            $window.location.reload();
        };
        
        
        /**
         * Quando o usuário clicar em qualquer botão padrão do sistema que envie o formulário
         */
        $(document).on("click", "#btnEnviar", function() {
            $.when(resultAjaxSubmit).then(function(r) {
                if (r['type'] === 'success') {
                    BaseService.salvarInfoLogin(r);
                    window.location.hash = '/mensagens'; 
                }
            });
        });

        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            BaseService.manterMercados();
        });

    }]);
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description Aplicativo de denúncia de invasão de areas públicas.
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('MainController', ['$scope', '$location', '$window', 'BaseService', 'ImagemService', 'LayoutService', 'UtilsService',  
                            function($scope, $location, $window, BaseService, ImagemService, LayoutService, UtilsService) {
        $scope.APPLICATION_ENV  = BaseService.APPLICATION_ENV;
        $scope.url              = BaseService.url;  
        $scope.login            = BaseService.login;  
        $scope.upload           = BaseService.upload;
        $scope.options;
        $scope.mercados;
        $scope.msgPainel;
        
        //Itens necessários para o projeto de visita. Ativados pela função "angular.element(document).ready"
        $scope.identity         = BaseService.identity;
        $scope.lstRelacao       = {};
        $scope.lstFornecedores  = {};
        $scope.lstFamilias      = {};
        $scope.lstSimilares     = {};
        $scope.lstConcorrentes  = {};
        $scope.lstProdutos      = {};
        
        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
            $location.path('/'+target);  
            $window.location.reload();
        };

        
        /**
         * Procedimento que envia ou salva as informações para serem enviadas depois
         * 
         * @param {int} [coSimilar]
         * @return {void}
         */
        $scope.salvarEnviarInformacoesSimilar = function(coSimilar) 
        {
            $(".btn-ok, .btnSalvarFamilia").button('loading');
            $("#formSalvarVisita"+coSimilar+" .msgSystemAlert").removeClass('in');
            
            //recupera as informações da tela do usuário e salva em variáveis
            if ($scope.prepararInformacoesSimilar(coSimilar)) {
                if ($scope.APPLICATION_ENV == 'development' || navigator.network.connection.type != Connection.NONE) {
                    $scope.enviarSemFotos();
                } else {
                    alert('Você não possui conexão com a internet, suas informações ficarão na área de "Denúncias pendentes".');
                    $scope.salvarBase();                
                }                
            }
        };
        
        
        /**
         * Salva as informações do formulário em um array, para posteriormente 
         * ser enviado para o servidor
         * 
         * @param {int} [coSimilar]
         * @returns {void}
         */
        $scope.prepararInformacoesSimilar = function(coSimilar) 
        {
            try {
                var result = false,
                    params = {};
                
                if ($("#ds_latlong").val() != '') {
                    $scope.options  = {};

                    //Pegando informações do formulário
                    params.co_funcionario                   = $("#formSalvarVisita"+coSimilar+" #co_funcionario"+coSimilar).val();
                    params.co_filial_mercado                = $("#formSalvarVisita"+coSimilar+" #co_filial_mercado"+coSimilar).val();
                    params.co_similar                       = $("#formSalvarVisita"+coSimilar+" #co_similar"+coSimilar).val();
                    params.ds_latlong                       = $("#formSalvarVisita"+coSimilar+" #ds_latlong"+coSimilar).val();
                    params.st_disponibilidade               = $("#formSalvarVisita"+coSimilar+" #st_disponibilidade"+coSimilar).val();
                    params.ds_confirmar_falta               = $("#formSalvarVisita"+coSimilar+" #ds_confirmar_falta"+coSimilar).val();
                    params.vl_meu_preco                     = $("#formSalvarVisita"+coSimilar+" #vl_meu_preco"+coSimilar).val();
                    params.lst_produtos_existentes          = $("#formSalvarVisita"+coSimilar+" #lst_produtos_existentes"+coSimilar).val();
                    
                    for (var i in $scope.lstConcorrentes[coSimilar]) {
                        params['vl_preco_concorrente'+i]    = $("#formSalvarVisita"+coSimilar+" #vl_preco_concorrente"+i).val();
                    }
                    
                    //Inindo as informações do formulário com a foto enviada para o servidor
                    $scope.options.params = params;
                    result = true;

                } else {
                    alert('Não foi possível identificar sua localização ative o serviço de localização.');
                    $(".btn-ok, .btnSalvarFamilia").button('reset');
                }
            } catch (e) {
                $(".btn-ok, .btnSalvarFamilia").button('reset');
                alert('Houve um erro interno e não foi possível carregar as informações para envio do formulário.');
            }
            
            return result;
        };
        
        
        /**
         * Procedimento que envia ou salva as informações para serem enviadas depois
         * 
         * @param {int} [coFamilia]
         * @return {void}
         */
        $scope.salvarEnviarInformacoesFamilia = function(coFamilia) 
        {
            $(".btn-ok, .btnSalvarFamilia").button('loading');
            $("#formSalvarVisitaFamilia"+coFamilia+" .msgSystemAlert"+coFamilia).removeClass('in');
            
            //recupera as informações da tela do usuário e salva em variáveis
            if ($scope.prepararInformacoesFamilia(coFamilia)) {
                if ($scope.APPLICATION_ENV == 'development' || navigator.network.connection.type != Connection.NONE) {
                    $scope.enviarInformacoesFamilia();
                } else {
                    alert('Você não possui conexão com a internet, suas informações ficarão na área de "Denúncias pendentes".');
                    $scope.salvarBase();                
                }                
            }
        };
        
        
        /**
         * Salva as informações do formulário em um array, para posteriormente 
         * ser enviado para o servidor
         * 
         * @param {int} [coFamilia]
         * @returns {void}
         */
        $scope.prepararInformacoesFamilia = function(coFamilia) 
        {
            try {
                var result = false,
                    params = {};
                
                if ($("#ds_latlong").val() != '') {
                    //Informações globais do arquivo
                    if ($scope.APPLICATION_ENV != 'development') {
                        $scope.options                 = new FileUploadOptions();
                        $scope.options.fileKey         = "file",
                        $scope.options.uri             = $(".foto-local").attr("src"),
                        $scope.options.fileName        = typeof $(".foto-local").attr("src") != 'undefined' ? $(".foto-local").attr("src").substr($(".foto-local").attr("src").lastIndexOf('/')+1) : '',
                        $scope.options.mimeType        = "text/plain";
                    } else {
                        $scope.options  = {};
                    }

                    //Pegando informações do formulário
                    params.co_funcionario           = $("#formSalvarVisitaFamilia"+coFamilia+" #co_funcionario"+coFamilia).val();
                    params.co_filial_mercado        = $("#formSalvarVisitaFamilia"+coFamilia+" #co_filial_mercado"+coFamilia).val();
                    params.co_familia               = $("#formSalvarVisitaFamilia"+coFamilia+" #co_familia"+coFamilia).val();
                    params.ds_latlong               = $("#formSalvarVisitaFamilia"+coFamilia+" #ds_latlong"+coFamilia).val();
                    params.tt_gondolas              = $("#formSalvarVisitaFamilia"+coFamilia+" #tt_gondolas"+coFamilia).val();
                    params.tm_gondolas              = $("#formSalvarVisitaFamilia"+coFamilia+" #tm_gondolas"+coFamilia).val();
                    params.tt_frente                = $("#formSalvarVisitaFamilia"+coFamilia+" #tt_frente"+coFamilia).val();
                    params.file                     = $("#formSalvarVisitaFamilia"+coFamilia+" .foto-local"+coFamilia).attr("src");                    
                    params.st_ponto_extra           = $("#formSalvarVisitaFamilia"+coFamilia+" #st_ponto_extra"+coFamilia).val();
                    
                    //Inindo as informações do formulário com a foto enviada para o servidor
                    $scope.options.params  = params;
                    result = true;

                } else {
                    alert('Não foi possível identificar sua localização ative o serviço de localização.');
                    $(".btn-ok, .btnSalvarFamilia").button('reset');
                }
            } catch (e) {
                $(".btn-ok, .btnSalvarFamilia").button('reset');
                alert('Houve um erro interno e não foi possível carregar as informações para envio do formulário.');
            }
            
            return result;
        };
        
        
        /**
         * Função responsável por enviar as informações do usuário para o servidor
         * 
         * @returns {void}
         */
        $scope.enviarInformacoesFamilia = function() 
        {
            if ($scope.options.params.file != './js/modules/mobileapp/layouts/imagens/fotos/foto1.jpg' ) {
                $scope.enviarComFotosFamilia();
            } else {
                $scope.enviarSemFotosFamilia();
            }
        };
        
        
        /**
         * Metodo de envio com imagens
         * 
         * @return {void}
         */
        $scope.enviarComFotosFamilia = function() 
        {
            try {
                var ft          = new FileTransfer(),
                    coFamilia   = $scope.options.params.co_familia;
                    
                exibirTarjaAjax('Enviando as informações, aguarde!'); 
                ft.upload($(".foto-local").attr("src"), encodeURI($scope.upload+'-familia'), function(r) {
                    console.log(r);
                    if (r.responseCode == 200) {
                        LayoutService._padraoSalvarFamilia(r, coFamilia, $scope.options);

                    } else if(r.responseCode == 404) {
                        alert('Não foi possível enviar as suas informações. Tente novamente mais tarde. Erro 404');
//                        $scope.salvarBase();
                    } else if(r.responseCode == 500) {
                        alert('Não foi possível enviar as suas informações. Tente novamente mais tarde. Erro 500');
//                        $scope.salvarBase();
                    }
                    $(".ajaxCarregando").remove();
                    
                }, function(error) {
                    alert('Não foi possível enviar as suas informações. Tente novamente mais tarde. Erro de envio');
                    console.log(error);
//                    $scope.salvarBase();

                }, $scope.options, true);
                
            } catch (e) {
                console.log(e);
            }                
        };
        
        
        /**
         * Metodo de envio sem que o usuário use fotos
         * 
         * @returns {void}
         */
        $scope.enviarSemFotosFamilia = function() 
        {
            var coFamilia = $scope.options.params.co_familia;
            
            $.post($scope.upload+'-familia', $scope.options.params, function(r) {
                LayoutService._padraoSalvarFamilia(r, coFamilia, $scope.options);
            });
        };
        
        
        /**
         * Metodo de envio sem que o usuário use fotos
         * 
         * @returns {void}
         */
        $scope.enviarSemFotos = function() 
        {
            var coSimilar = $scope.options.params.co_similar;
            
            $.post($scope.upload, $scope.options.params, function(r) {
                LayoutService._padraoSalvarSimilar(r, coSimilar, $scope.options);
            });
        };
        
        
        /**
         * Enviando informações diretamente da base de dados.
         * 
         * @param {int} [key]
         * @returns {void}
         */
        $scope.enviarDaBase = function(key) 
        {
            try {
                var ft          = new FileTransfer();
                $scope.options  = JSON.parse(localStorage.getItem(key));

                if (navigator.network.connection.type != Connection.NONE) {
                    ft.upload($scope.options.uri, encodeURI($scope.upload), function(r) {
                        if (r.responseCode == 200) {
                            /** @todo remover em produção */
                            console.log("Response = " + r.response);
                            localStorage.removeItem(key);
                            
                            alert('Mensagem enviada com sucesso!');
                            window.location.hash = '/';                        

                        } else if(r.responseCode == 404) {
                            alert('Sua aplicação pode esta desatualizada, atualize para e tente enviar a denúncia mais tarde.');

                        } else if(r.responseCode == 500) {
                            alert('O servidor de resposta esta indisponível no momento, tente novamente mais tarde!');
                        }
                    }, function(error) {
                        alert("Devido um erro interno não foi possível enviar suas informações para o servidor da camara.");
                    }, $scope.options, true);
                } else {
                    alert("Para enviar esta denúncia é necessário estar conectado a internet.");
                }
            } catch (e) {}                
        };
        
        
        /**
         * Verifica se a mensasgem foi carregada na variável e exibe na tela do usuário
         * 
         * @returns {void}
         */
        $scope.initAreaMensagem = function() 
        {
            $scope.msgPainel = BaseService.getMsgPainel();
            $(".tela2 .titulo").html($scope.msgPainel['titulo']);
            $(".tela2 .mensagem").html($scope.msgPainel['mensagem']);
        };
        
        
        /**
         * Verifica se as variáveis de ambientes foram preenchidas com os valores do servidor
         * e prepara para exibir o select de fornecedores.
         * 
         * @returns {void}
         */
        $scope.initAreaVisita = function() 
        {
            if (Object.keys($scope.lstFornecedores).length == 0 ) {
                $scope.identity         = BaseService.getIdentity();
                $scope.lstRelacao       = BaseService.getLstRelacao();
                $scope.lstFornecedores  = BaseService.getFornecedores();
                $scope.lstFamilias      = BaseService.getFamilia();
                $scope.lstSimilares     = BaseService.getCatSimilares();
                $scope.lstProdutos      = BaseService.getProdutos();
                $scope.lstConcorrentes  = BaseService.getConcorrentes();
            }

            UtilsService._getLatLong();
            LayoutService._formSelectFornecedor($scope.lstFornecedores, $scope.lstFamilias);
        };
        
        
        /**
         * Exibe informações de acordo com a escolha da categoria do usuário
         */
        $(document).on("change", "#co_categoria", function() {
            var coCategoria = $(this).val();
            
            $("[id^='co_subcategoria_']").addClass('hidden');
            $(".listarProdutos").addClass('hidden');
            if (coCategoria != '') {
                $(".familia, #co_subcategoria_"+coCategoria).removeClass('hidden');
            } else {
                $(".familia, #co_subcategoria_"+coCategoria).addClass('hidden');
            }

            UtilsService._getLatLong();

        }).on("change", "[id^='co_subcategoria_']", function() {
            $(".listarProdutos").removeClass('hidden');
        });


        /**
         * Quando o usuário informar se tem ou não o produto.
         */
        $(document).on("click", ".item-produto .tem-o-produto>span[class*='btn']", function() {
            var btn         = $.inArray('btnSim', $(this).attr('class').split(' ')) != -1 ? 'btnSim' : 'btnNao',
                coProduto   = $(this).parents('form').attr('id').replace(/[A-Za-z_$-]/g, '');

            $(this).removeClass('opacity-menor').parent().find(':not(.'+ btn +')').addClass('opacity-menor');
            $(this).parent().removeClass('tem-o-produto-sim').removeClass('tem-o-produto-nao').addClass(btn == 'btnSim' ? 'tem-o-produto-sim' : 'tem-o-produto-nao');

            if (btn == 'btnSim') {
                $(this).parents(".detalhes-produto").find('.mostra-detalhes-produtos').removeClass('hidden');
                $(this).parents(".detalhes-produto").find('.confirmarFaltaProduto').addClass('hidden');
                $("#st_disponibilidade"+coProduto).val('S');
            } else {
                $(this).parents(".detalhes-produto").find('.mostra-detalhes-produtos').addClass('hidden');
                $(this).parents(".detalhes-produto").find('.confirmarFaltaProduto').removeClass('hidden');
                $("#st_disponibilidade"+coProduto).val('N');
            }
        });
        
        /**
         * Quando o usuário informar se tem ou não o produto similar.
         */
        $(document).on("click", ".item-produto .pdv-similares .tem-similares>span[class*='btn']", function() {
            var btn = $.inArray('btnSim', $(this).attr('class').split(' ')) != -1 ? 'btnSim' : 'btnNao';
            
            $(this).removeClass('opacity-menor').parent().find(':not(.'+ btn +')').addClass('opacity-menor');
            if (btn === 'btnSim') {
                $(this).parents('.pdv-similares').next().addClass('hidden');
            } else {
                $(this).parents('.pdv-similares').next().removeClass('hidden');
                $(this).parents('.pdv-similares').next().find("span").addClass('opacity-menor');
            }
            
        }).on("click", ".item-produto .pdv-similares-result .item-produto-similar>span[class*='btn']", function() {
            var correspondente  = $(this).parents('.pdv-similares-result').prev().find('.opacity-menor').hasClass('btnNao') ? 'sim' : 'nao',
                coSimilar       = $(this).attr('id').substr(0, $(this).attr('id').indexOf("produto")),
                coProduto       = $(this).attr('id').substr($(this).attr('id').indexOf("produto")+7),
                arrProdutos     = new Array(),
                coIndex         = -1;
        
            if (correspondente === 'sim') {
                $(this).toggleClass('opacity-menor');
                arrProdutos = $("#lst_produtos_existentes"+coSimilar).val().split(';');

                if (!$(this).hasClass("opacity-menor")) {
                    arrProdutos.push(coProduto);
                } else {
                    coIndex = arrProdutos.indexOf(coProduto);
                    if (coIndex > -1) {
                        arrProdutos.splice(coIndex, 1);
                    }
                }
                $("#lst_produtos_existentes"+coSimilar).val(arrProdutos.join(';'));
            }
        });


        /**
         * Exibe uma área específica do produto que existe no mercado.
         */
        $(document).on("click", ".mostra-detalhes-produtos>div", function() {
            var target  = $(this).parents('form').attr('id'),
                btn     = $(this).attr('class');
            $("#"+ target +" ."+btn+"-result").toggleClass('hidden');
            $("#"+ target +" ."+btn+"-detalhes>p>span").toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-menu-right');
        });


        /**
         * Existe ou não ponto extra??
         */
        $(document).on("click", ".pontoExtra-result>span", function() {
            var btn = $(this).hasClass('sim-extra') ? 'sim' : 'nao';
            $(this).parent().find('.sim-extra, .nao-extra').removeClass('active');
            $(this).addClass('active');
            $(this).parent().find("input[id^='st_ponto_extra']").val(btn == 'sim' ? 'S' : 'N');
        });


        /**
         * Função que será chamada sempre que uma subcategoria for selecionada
         *   -- Verifica se o item já foi salvo na base de dados.
         * 
         * @returns {void}
         */
        $(document).on("change", "[id^='co_subcategoria_']", function() {
            var noSubcategoria      = $(this).find("option:selected").text(),
                coSubcategoria      = parseInt($(this).val()),
                lstPrdVisitado      = BaseService.cadastrarItensVisitados(null, null),
                produtosExistentes  = new Array();

            if (typeof $scope.lstSimilares[coSubcategoria] != 'undefined') {
                $(".resultado-da-pesquisa .titulo span").html(noSubcategoria);
                $(".resultado-da-pesquisa .numero-itens span").html(Object.keys($scope.lstSimilares[coSubcategoria]).length);
                $(".areaProdutos").html('');
                $(".areaProdutos").append( LayoutService._layoutSimilares($scope.lstSimilares[coSubcategoria], $scope.lstProdutos, $scope.lstConcorrentes, coSubcategoria, $scope.upload, $scope.identity.coFuncionario, $scope.identity.coFilial, $scope.identity.latLong));
                $("input[name^='vl_']").mask('000.000.000.000.000,00', {reverse: true});

                //Garante que o usuário visualizará as informações que foram enviadas para o servidor.
                for (var i in lstPrdVisitado) {
                    var params      = lstPrdVisitado[i].params,
                        coSimilar   = typeof params.co_similar ? params.co_similar : null,
                        coFamilia   = params.co_familia ? params.co_familia : null;

                    //Preencher campos com os valores informados
                    for (var p in params) {
                        if (coSimilar != null) {
                            $("#formSalvarVisita"+coSimilar+" #"+p+", #formSalvarVisita"+coSimilar+" #"+p+coSimilar).val(params[p]);                    
                        } else {
                            $("#formSalvarVisitaFamilia"+coFamilia+" #"+p+coFamilia).val(params[p]);
                        }
                    }

                    //Peculiaridades Similar depois Família
                    if (typeof params['lst_produtos_existentes'] != 'undefined') {//Peculiaridades similar
                        $("#formSalvarVisita"+coSimilar+" .glyphicon-heart-empty").removeClass('glyphicon-heart-empty icoEnviar').addClass('glyphicon-heart');
                        if (params.st_disponibilidade == 'S') {
                            $("#formSalvarVisita"+coSimilar+" .tem-o-produto>.btnSim").removeClass('opacity-menor');
                            $("#formSalvarVisita"+coSimilar+" .tem-o-produto").addClass('tem-o-produto-sim');
                            $("#formSalvarVisita"+coSimilar+" .mostra-detalhes-produtos").find('input').attr('readonly', 'readonly');
                            $("#formSalvarVisita"+coSimilar+" .btnNao").removeClass('btnNao');
                        } else {
                            $("#formSalvarVisita"+coSimilar+" .tem-o-produto>.btnNao").removeClass('opacity-menor');
                            $("#formSalvarVisita"+coSimilar+" .tem-o-produto").addClass('tem-o-produto-nao');
                            $("#ds_confirmar_falta"+coSimilar).val('em falta').attr('readonly', 'readonly');
                            $("#formSalvarVisita"+coSimilar+" .btnSim").removeClass('btnSim');
                        }                        
                        
                        produtosExistentes = params['lst_produtos_existentes'].split(';');
                        for (var prod in produtosExistentes) {
                            if (produtosExistentes[prod] != '') {
                                $("#formSalvarVisita"+coSimilar+" .tem-similares .btnSim").removeClass('opacity-menor');
                                $("#formSalvarVisita"+coSimilar+" #"+coSimilar+"produto"+produtosExistentes[prod]).removeClass('opacity-menor');
                            }
                        }  
                        
                    } else {//Peculiaridades família
                        $("#formSalvarVisitaFamilia"+coFamilia+" ."+ (params.st_ponto_extra == 'S' ? 'sim-extra' : 'nao-extra')).addClass('active');
                        $("#formSalvarVisitaFamilia"+coFamilia+" .mostra-detalhes-produtos").find('input').attr('readonly', 'readonly');
                        $(".btnSalvarFamilia"+coFamilia).prop("disabled", true).html('Família concluída');
                    }
                }
            }
        });      


        /**
         * Quando o usuário clicar sobre o botão de tirar foto
         */
        $(document).on("click", ".imgPhotoClick", function() {
            ImagemService.capturarFoto();
        }).on("click", '.btnRemoverImagem', function() {
            ImagemService.removerImagem();
        });
        
        
        /**
         * Quando o usuário clicar sobre o botão salvar
         */
        $(document).on("click", ".icoEnviar", function() {
            var coSimilar = $(this).attr('data-id');
            $scope.salvarEnviarInformacoesSimilar(coSimilar);
        });

        /**
         * Quando o usuário clicar sobre o botão salvar família
         */
        $(document).on("click", ".btnSalvarFamilia", function() {
            var coFamilia = $(this).attr('data-id');
            $scope.salvarEnviarInformacoesFamilia(coFamilia);
        });
        
        
        /**
         * Quando o usuário clicar em qualquer botão padrão do sistema que envie o formulário
         */
        $(document).on("click", "#btnEnviar", function() {
            $.when(resultAjaxSubmit).then(function(r) {
                if (r['type'] === 'success') {
                    BaseService.salvarInfoLogin(r);
                    window.location.hash = '/mensagens'; 
                }
            });
        });
        
        
        /**
         * Ações a serem tomadas quando o usuário clicar sobre o botão sair
         */
        $(document).on("click", ".btn-sair", function() {
            localStorage.clear();
            window.location.hash = '/#'; 
        });
        
        /**
         * Quando o usuário tentar salvar informações de um produto concorrente
         */
        $(document).on("click", ".btnSalvarConcorrente", function() {
            var url             = $(this).parent().attr('data-url'),
                coSimilar       = $(this).attr('data-id'),
                noConcorrente   = $("#no_concorrente"+coSimilar).val(),
                data            = {},
                data1           = {},
                lstSimilares    = BaseService.getSimilares(),
                self            = this;
                
            if (noConcorrente != '') {
                $(self).button('loading');
                $.post(url, {'co_similar': coSimilar, 'no_concorrente': noConcorrente}, function(r) {
                    if (r.type === 'success') {
                        data[r.id] = noConcorrente;
                        if (typeof lstSimilares.concorrentes[coSimilar] != 'undefined') {
                            $.extend(lstSimilares.concorrentes[coSimilar], data);
                        } else {
                            data1[coSimilar] = data;
                            $.extend(lstSimilares.concorrentes, data1);
                        }
                        
                        $("#no_concorrente"+coSimilar).val('');
                        BaseService.setSimilares(lstSimilares);
                        $scope.lstConcorrentes  = BaseService.getConcorrentes();
                        $('<input type="text" placeholder="Preço '+noConcorrente+'" name="vl_preco_concorrente'+r.id+'" id="vl_preco_concorrente'+r.id+'">').insertBefore(".fieldBtnAddConcorrente"+coSimilar);                        
                        $(".areaAddConcorrente"+coSimilar).removeClass('in');
                        $(self).button('reset');
                    } else {
                        alert(r.flashMsg);
                    }
                });
            } else {
                alert('É necessário informar um nome do produto concorrente!');
            }
        });
        

        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            if (window.location.hash == '#/') {
                BaseService.manterMercados();
            } else if(window.location.hash == '#/mensagens') {
                $scope.initAreaMensagem();
            }
            $scope.initAreaVisita();
        });
 
    }]);
'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:MainController
 * @description Aplicativo de denúncia de invasão de areas públicas.
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('MensagensController', ['$scope', '$location', '$window', 'BaseService', function($scope, $location, $window, BaseService) {
        $scope.APPLICATION_ENV  = BaseService.APPLICATION_ENV;
        $scope.url              = BaseService.url;  
        $scope.login            = BaseService.login;  
        $scope.upload           = BaseService.upload;
        $scope.options;
        $scope.mercados;
        $scope.msgPainel;
        
        //Itens necessários para o projeto de visita. Ativados pela função "angular.element(document).ready"
        $scope.identity         = BaseService.identity;
        $scope.lstRelacao       = {};
        $scope.lstFornecedores  = {};
        $scope.lstFamilias      = {};
        $scope.lstSimilares     = {};
        $scope.lstConcorrentes  = {};
        $scope.lstProdutos      = {};
        
        
        /**
         * Redireciona e refresh na tela do usuário
         * 
         * @param {string} [target]
         * @returns {void}
         */
        $scope.redirecionar = function(target) 
        {
            $location.path('/'+target);  
            $window.location.reload();
        };
        
        
        /**
         * Verifica se a mensasgem foi carregada na variável e exibe na tela do usuário
         * 
         * @returns {void}
         */
        $scope.initAreaMensagem = function() 
        {
            $scope.msgPainel = BaseService.getMsgPainel();
            $(".tela2 .titulo").html($scope.msgPainel['titulo']);
            $(".tela2 .mensagem").html($scope.msgPainel['mensagem']);
        };
        
        
        /**
         * informa para o sistema que o usuário fez checkin no sistema
         * 
         * @returns {void}
         */
        $scope.efetuarChekin = function() 
        {
            $.post(BaseService.urlCheckin, {co_funcionario: $scope.identity.coFuncionario}, function(r) {
                alert(r.flashMsg);
                window.location.hash = "/visita";
                $window.location.reload();
            });
        };
        
        
        /**
         * informa para o sistema que o usuário fez checkin no sistema
         * 
         * @returns {void}
         */
        $scope.efetuarChekout = function() 
        {
            $.post(BaseService.urlCheckout, {co_funcionario: $scope.identity.coFuncionario}, function(r) {
                alert(r.flashMsg);
            });
        };


        /**
         * Efetua checkin
         */
        $(document).on("click", "#btnCheckin", function() {
            $scope.efetuarChekin();
        });


        /**
         * Efetua checkout
         */
        $(document).on("click", "#btnCheckout", function() {
            $scope.efetuarChekout();
        });
    

        /**
         * INIT:
         */
        angular.element(document).ready(function() {
            $scope.initAreaMensagem();
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
        })
        .when('/lembrar-senha', {
            templateUrl: './js/modules/mobileapp/views/scripts/home/lembrar-senha.html',
            controller: 'HomeController'
        })     
        .when('/mensagens', {
            templateUrl: './js/modules/mobileapp/views/scripts/mensagens/mensagens.html',
            controller: 'MensagensController'
        })
        .when('/check', {
            templateUrl: './js/modules/mobileapp/views/scripts/mensagens/check.html',
            controller: 'MensagensController'
        })
        .when('/visita', {
            templateUrl: './js/modules/mobileapp/views/scripts/main/visita.html',
            controller: 'MainController'
        })        
        .otherwise({redirectTo: '/'});
}]);
