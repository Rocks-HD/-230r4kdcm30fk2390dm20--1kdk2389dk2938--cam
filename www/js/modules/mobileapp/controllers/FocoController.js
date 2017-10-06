'use strict';

/**
 * 
 * @ngdoc function
 * @name camara.controller:AberturaController
 * @description 
 * @author Bruno da Costa Monteiro <brunodacostamonteiro@gmail.com>
 */
angular.module('camara')
    .controller('FocoController', ['$scope', '$timeout', 'ModelDeputados', 'ModelGeral', 'ModelProposicoes', function FocoController($scope, $timeout, ModelDeputados, ModelGeral, ModelProposicoes) {
        $scope.lstEstados       = new Array();
        $scope.lstPartidos      = new Array();
        
        $scope.labelsEstado     = [];
        $scope.dataEstado       = [];
        $scope.optionsEstado    = { title: { display: false, position: 'bottom'}, legend: { display: true } };
        
        $scope.labelsPartido    = [];
        $scope.dataPartido      = [];
        $scope.optionsPartido   = { title: { display: false, position: 'bottom'}, legend: { display: true } };
        
        $scope.nuDeputados      = 0;

        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.graficoEstado = function() 
        {
            var lstEstados = ModelGeral.listarEstadosLocal();
            
            for (var i in lstEstados) {
                if (lstEstados[i] != '') {
                    $scope.labelsEstado.push(i);             
                    $scope.dataEstado.push(lstEstados[i]);
                    $scope.nuDeputados += lstEstados[i];
                }
            }
            $(".carregandoGraficoEstado").hide();
            $(".graficoEstado").show();
        };


        /**
         * Insere no select:ds_estado os estados para formar filtro
         * 
         * @returns {void}
         */
        $scope.graficoPartidos = function() 
        {
            var lstPartidos = ModelGeral.listarPartidosLocal();
            
            for (var i in lstPartidos) {
                if (lstPartidos[i] != '') {
                    $scope.labelsPartido.push(i);             
                    $scope.dataPartido.push(lstPartidos[i]);             
                }
            }
            $(".carregandoGraficoPartido").hide();
            $(".graficoPartido").show();
        };


        /**
         * 
         * @returns {void}
         */
        $scope.preencherInfoBlocoPartidario = function() 
        {
            var listarBlocos = ModelGeral.listarBlocoPartidario();
            var html        = '';
            var contador    = 0;
            var giro        = 0;

            if (typeof listarBlocos != 'undefined' && Object.keys(listarBlocos).length >= 1 && $(".lstBlocosPartidarios").html() == '') {
                for (var i in listarBlocos) {
                    html += '<div class="col-xs-6 text-center btnBlocosPartidarios fundo-cinza-'+ ((++contador%2 == 0) ? (giro%2 != 0 ? 'claro' : 'escuro') : (giro%2 != 0 ? 'escuro' : 'claro')) +' padding-vertical" data-id="'+ i +'"><h3>'+ i +'</h3>'+ listarBlocos[i] +' deputados<img src="./js/modules/mobileapp/layouts/imagens/icones/ico-mao-clique.svg" alt="clique e saiba mais" class="posicionamento-mao"/></div>';
                    $(".lstBlocosPartidarios").html(html);
                    if (contador%2 == 0) {++giro;}
                }
            } else {
                $scope.timeoutPreencherInfoBlocoPartidario();
            }
        };
        
        
        /**
         * Tenta exibir as informações dos blocos partidários quando a primeira tentativa não der certo
         * return {void}
         */
        $scope.timeoutPreencherInfoBlocoPartidario = function()
        {
            $timeout(function() {
                $scope.preencherInfoBlocoPartidario();
            }, 2000);
        };


        /**
         * Lista as comissões permantentes;
         *     -- A listagem consegue retornar todas as comissões, porém apenas as permanentes serão exibidas
         *  
         */
        $scope.preencherInfoComissoes = function() 
        {
            var listarOrgaos = ModelGeral.listarOrgaos();
            var html        = '';

            if (typeof listarOrgaos != 'undefined' && Object.keys(listarOrgaos).length >= 1 && $(".areaListagemComissoes").html() == '') {
                for (var i in listarOrgaos) {
                    html += '<div class="row fundo-dfdfdf infoComissao borda-inferior" data-id="'+ listarOrgaos[i]['id'] +'">'+
                                '<div class="col-xs-10 fundo-cinza-claro padding-vertical"><h3>'+ listarOrgaos[i]['descricao'] +'</h3></div>'+
                                '<div class="col-xs-2 text-center fundo-cinza-escuro padding-vertical"><i class="material-icons">arrow_drop_down_circle</i></div>'+
                            '</div>'+
                            '<div class="row linha'+ listarOrgaos[i]['id'] +'" style="display:none; background:#333;">'+
                            '</div>';
                    $(".areaListagemComissoes").html(html);
                }
            } else {
                $scope.timeoutpreencherInfoComissoes();
            }
        };
        
        
        /**
         * Tenta exibir as informações das comissões quando a primeira tentativa não der certo
         * return {void}
         */
        $scope.timeoutpreencherInfoComissoes = function()
        {
            $timeout(function() {
                $scope.preencherInfoComissoes();
            }, 2000);
        };        


        /**
         * lista as proposições existentes de acordo com o filtro selecionado
         * 
         * @returns {undefined}
         */
        $scope.listarProposicoes = function() 
        {
            try {
                var ano                 = $("#ano").val(),
                    filtro              = $("#filtro").val(),
                    listarProposicoes   = ModelProposicoes.listarProposicoesVotadasEmPlenario(ano),
                    lstCodProposicao    = {},
                    lstOpiniao          = '',
                    contador            = 0;


                $(".areaProposicoes").html('');
                $.when(listarProposicoes).then(function(prop1) {
                    var proposicoes = prop1 instanceof XMLDocument ? $.xml2json(prop1)['#document']['proposicoes']['proposicao'] : prop1;
                    for (var i in proposicoes) {
                        lstCodProposicao[proposicoes[i]['codProposicao']] = proposicoes[i]['nomeProposicao'];
                        if (++contador == 100) { break };
                    }
                    
                    var detalhesProposicoes = ModelProposicoes.detalhesProposicoes(lstCodProposicao);
                    $.when(detalhesProposicoes).then(function(detalhes) {
                        var html = '';
                        for (var i in detalhes['dados']) {
                            html =  '<div class="linha-zebrada item'+ detalhes['dados'][i]['id'] +'" data-id="'+ detalhes['dados'][i]['id'] +'">'+
                                        '<div class="row fundo-dfdfdf">'+
                                            '<div class="col-xs-10 fundo-cinza-claro padding-vertical">'+
                                                '<h3>'+ lstCodProposicao[detalhes['dados'][i]['id']] +'</h3>'+
                                                '<h6>'+ detalhes['dados'][i]['ementa'] +'</h6>'+
                                            '</div>'+
                                            '<div class="col-xs-2 text-center fundo-cinza-escuro padding-vertical">'+
                                                '<i class="material-icons">arrow_drop_down_circle</i>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="row proposicao'+ detalhes['dados'][i]['id'] +'" style="display:none;">'+
                                            '<div class="col-xs-12 fundo-preto padding-vertical texto-branco">'+
                                                '<p>Nos envie sua opinião sobre a proposição, basta preencher o campo abaixo e enviar para nós.</p>'+
                                                '<br>'+
                                                '<form>'+
                                                    '<textarea class="img-100"></textarea><br><br>'+
                                                    '<button class="btn-verde">ENVIAR</button>'+
                                                '</form>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                            $(".areaProposicoes").append(html);
                        }
                        lstOpiniao = $scope.listarOpinioes();
                        
                        if (filtro == 'votados') {
                            $(".areaProposicoes .linha-zebrada").addClass('hidden');
                            for (var i in lstOpiniao) {
                                $(".item"+lstOpiniao[i]['coProposicao']).removeClass('hidden');
                            }
                        } else if (filtro == 'naoVotados') {
                            for (var i in lstOpiniao) {
                                $(".item"+lstOpiniao[i]['coProposicao']).addClass('hidden');
                            }
                        }
                    });
                });
    
            } catch (e) {window.location.reload();}           
        };
        
        
        /**
         * 
         * @returns {undefined}
         */
        $scope.listarOpinioes = function() 
        {
            var lstopinioes = ModelProposicoes.listarOpinioes();
            
            for (var i in lstopinioes) {
                var tpEscolha = lstopinioes[i]['tpVoto'] == 'favor' ? '.icon-ico-a-favor-1' : '.icon-ico-contra-2';
                
                $(".item"+lstopinioes[i]['coProposicao']+" "+tpEscolha).addClass('active');
            }
            
            return lstopinioes;
        };

        /**
         * 
         */
        $(document).on('click', '.infoComissao', function() {
            var coComissao      = $(this).attr('data-id');
            var corMembro       = { 'Presidente' : 'vermelho', 
                                    'PrimeiroVice-Presidente' : 'verde', 
                                    'SegundoVice-Presidente' : 'roxo', 
                                    'TerceiroVice-Presidente' : 'azul-escuro', 
                                    'Titular' : 'cinza-escuro'};
            
            if (!$(".linha"+coComissao).is(":visible")) {
                var infoComissao    = ModelGeral.obterMembrosOrgao(coComissao),
                    html            = '';
                    
                $(".linha"+coComissao).show().html('Carregando...'); 
                $.when(infoComissao).then(function(r) {
                    var membro = $.xml2json(r)['#document']['orgao']['membros'];
                    for (var i in membro) {
                        if (i !== 'Suplente' && i !== 'Titular' && i != '$') {
                            html  += '<div class="col-xs-6 fundo-'+ corMembro[i] +' padding-vertical texto-branco text-center">'+
                                        '<a href="#/conheca/'+ membro[i]['ideCadastro'] +'" class="texto-branco">'+
                                            '<p>'+ membro[i]['nome'] +' <br> '+ membro[i]['partido'] +'/'+ membro[i]['uf'] +'</p>'+
                                        '</a>'+
                                    '</div>';
                        }
                        $(".linha"+coComissao).html('').append(html);
                        
                        if (i == 'Titular') {
                            for (var t in membro[i]) {
                                html  += '<div class="col-xs-6 padding-vertical texto-branco text-center">'+
                                            '<a href="#/conheca/'+ membro[i][t]['ideCadastro'] +'" class="texto-branco">'+
                                                '<p>'+ membro[i][t]['nome'] +' <br> '+ membro[i][t]['partido'] +'/'+ membro[i][t]['uf'] +'</p>'+
                                            '</a>'+
                                        '</div>';

                                $(".linha"+coComissao).html('').append(html);
                            }
                        }
                    }
                });
            } else {
                $(".linha"+coComissao).hide(); 
            }
        });


        //Se o usuário clicar sobre um bloco será informado sobre os partidos que existem internamente
        $(document).on('click', '.btnBlocosPartidarios', function() {
            var coBloco     = $(this).attr('data-id'),
                infoBloco   = ModelGeral.infoBlocoPartidario(coBloco),
                html        =   '<div><strong>Nome do Bloco:</strong> '+ infoBloco['nomeBloco'] +'</div>'+
                                '<div><strong>Sigla:</strong> '+ infoBloco['siglaBloco'] +'</div>'+
                                '<div><strong>Data de Criaçao:</strong> '+ infoBloco['dataCriacaoBloco'] +'</div>'+
                                '<div><strong>Data de Extinção: <span class="text-danger">'+ infoBloco['dataExtincaoBloco'] +'</span></strong></div><hr />';
                        
                for (var i in infoBloco['Partidos']['partido']) {
                    html += '<ul style="padding-left:20px">';
                    html += '<li class=""><strong>Nome do Partido:</strong> <span class="text-info">'+ infoBloco['Partidos']['partido'][i]['nomePartido'] +'</span></li>';
                    html += '<li class=""><strong>Sigla do Partido:</strong> '+ infoBloco['Partidos']['partido'][i]['siglaPartido'] +'</li>';
                    html += '<li class=""><strong>Adesão ao bloco:</strong> '+ infoBloco['Partidos']['partido'][i]['dataAdesaoPartido'] +'</li>';
                    html += '<li class=""><strong>Desligamento:  <span class="text-danger"> '+ infoBloco['Partidos']['partido'][i]['dataDesligamentoPartido'] +'</span></strong></li>';
                    html += '</ul><hr />';
                }
                
            $("#systemModal .modal-body").html(html);
            $("#systemModal").modal();
        });

        //CHANGE: quando modificar o ano/filtro da área de comissões
        $(document).on("change", "#ano", function() {
            $scope.listarProposicoes();
        }).on("change", "#filtro", function() {
            $scope.listarProposicoes();
        });


        /**
         * Garantir uma nova model
         * @returns {undefined}
         */
        window.onhashchange = function() {
            window.location.reload();
        };
        
        /**
         * INIT: 
         */
        angular.element(document).ready(function() {
            var lstDeputados = ModelDeputados.listarDeputados(1);

            $.when(lstDeputados).then(function(r) {
                $scope.graficoEstado();
                $scope.graficoPartidos();
                $scope.preencherInfoBlocoPartidario();
                $scope.preencherInfoComissoes();
            });
        });

    }]);
