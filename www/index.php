<?php header('Access-Control-Allow-Origin: *'); ?>
<?php header('Control-Allow-Credentials: true'); ?>
<?php header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"'); ?>
<html>
    <head>
        <title>Camara</title>
        <meta charset="UTF-8">
        <meta http-equiv="Access-Control-Allow-Origin" content="*">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' 'unsafe-eval' *; media-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' 'unsafe-inline' 'unsafe-eval' *">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="./js/library/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="./js/modules/mobileapp/layouts/css/mobile.css" rel="stylesheet" type="text/css"/>
        <link href="./js/modules/mobileapp/layouts/icomoon/style.css" rel="stylesheet" type="text/css"/>

        <script src="cordova.js" type="text/javascript"></script>
        <script src="./js/library/compile-header.js" type="text/javascript"></script>

        <script type="text/javascript">
            setTimeout(function () {
                $(".carregando").hide();
                $(".areaPrincipal").removeClass('hidden');
            }, 5000);

            var APPLICATION_ENV = document.URL.indexOf("host.camaraapp") !== -1 ? 'development' : 'production';
            var arrayArquivos = {
                'development': [
//                    './js/library/angular/angular.js',
//                    './js/library/angular-route/angular-route.min.js',
//                    './js/library/angular-resource/angular-resource.min.js',
//                    './js/library/angular-ui-router/angular-ui-router.min.js',
//                    './js/library/angular-sanitize/angular-sanitize.min.js',
                    './js/library/compile-footer.js',
                    './js/modules/mobileapp/configs/app.js',
                    './js/modules/mobileapp/services/LayoutService.js',
                    './js/modules/mobileapp/services/UtilsService.js',
                    './js/modules/mobileapp/model/tableGateway/TGDeputados.js',
                    './js/modules/mobileapp/model/tableGateway/TGDespesas.js',
                    './js/modules/mobileapp/model/tableGateway/TGGeral.js',
                    './js/modules/mobileapp/model/ModelDespesas.js',
                    './js/modules/mobileapp/model/ModelDeputados.js',
                    './js/modules/mobileapp/model/ModelGeral.js',
                    './js/modules/mobileapp/controllers/HomeController.js',
                    './js/modules/mobileapp/controllers/DeputadoController.js',
                    './js/modules/mobileapp/controllers/OpniaoController.js',
                    './js/modules/mobileapp/controllers/CompararController.js',
                    './js/modules/mobileapp/configs/routes.js',
                    './js/modules/mobileapp/functions/Development.js',
//                    './js/library/mCustomScrollbar/js/minified/jquery.mCustomScrollbar.min.js',
                    './js/library/chart.js/dist/Chart.min.js',
                    './js/library/angular-chart.js/dist/angular-chart.min.js'
                ],
                'production': [
                    './js-min/modules/mobileapp/compile-footer.js',
                    './js-min/modules/mobileapp/production.js',
                    './js-min/modules/mobileapp/functions.js'
                ]
            };

            $(document).ready(function () {
                $.each(arrayArquivos[APPLICATION_ENV], function (i, e) {
                    $("body").append('<script type="text/javascript" src="' + e + '"><\/script>');
                });
            });
        </script>
    </head>

    <body ng-app="camara" id="context">

        <!-- Remover na produção style="display: none;" -->
        <div class="carregando" style="display: none;">Carregando...</div>

        <div class="container-fluid">
            <header class="row">
                <div class="col-xs-6">
                    <div id="btn-menu">
                        <span class="glyphicon glyphicon-menu-hamburger alacazan"></span>
                    </div>
                </div>
                <div class="col-xs-6 text-right">
                    <div id="logo">
                        <img src="/js/modules/mobileapp/layouts/imagens/logos/logo-app-branco.svg" alt="Projeto EDO"/>
                    </div>
                </div>
            </header>
            <nav class="row text-center menu-principal">
                <div ng-click="$scope.redirecionar('/')" class="col-xs-6 col-sm-3 margin-vertical"><img src="/js/modules/mobileapp/layouts/imagens/icones/ico-home.svg" alt="home"/><br>Página inicial do aplicativo</div>
                <div ng-click="$scope.redirecionar('/')" class="col-xs-6 col-sm-3 margin-vertical"><img src="/js/modules/mobileapp/layouts/imagens/icones/ico-opiniao.svg" alt="sua opinião"/><br>sua opinião nas votações</div>
                <div ng-click="$scope.redirecionar('/')" class="col-xs-6 col-sm-3 margin-vertical"><img src="/js/modules/mobileapp/layouts/imagens/icones/ico-ranking.svg" alt="ranking dos deputados"/><br>ranking dos deputados</div>
                <div ng-click="$scope.redirecionar('/')" class="col-xs-6 col-sm-3 margin-vertical"><img src="/js/modules/mobileapp/layouts/imagens/icones/ico-creditos.svg" alt="créditos do app"/><br>créditos do aplicativo</div>
            </nav>
        </div>

        <!-- Corpo do projeto -->
        <div ng-view="" class="ng-scope"></div>
        <!-- Corpo do projeto -->

        <div class="container-fluid rodape">
            <div class="row">
                <div class="col-xs-6">
                    <img src="/js/modules/mobileapp/layouts/imagens/logos/logo-camara.png" alt=""/>
                </div>
                <div class="col-xs-6 text-right">
                    <img src="/js/modules/mobileapp/layouts/imagens/logos/logo-desafio.png" alt=""/>
                </div>
            </div>
        </div>
    </body>
</html>
