    function number_format(number,decimals,dec_point,thousands_sep){number=(number+'').replace(/[^0-9+\-Ee.]/g,'');var n=!isFinite(+number)?0:+number,prec=!isFinite(+decimals)?0:Math.abs(decimals),sep=(typeof thousands_sep==='undefined')?',':thousands_sep,dec=(typeof dec_point==='undefined')?'.':dec_point,s='',toFixedFix=function(n,prec){var k=Math.pow(10,prec);return''+Math.round(n*k)/k;};s=(prec?toFixedFix(n,prec):''+Math.round(n)).split('.');if(s[0].length>3){s[0]=s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,sep);}
    if((s[1]||'').length<prec){s[1]=s[1]||'';s[1]+=new Array(prec-s[1].length+1).join('0');}
    return s.join(dec);}
    function str_pad(input,pad_length,pad_string,pad_type){var half='',pad_to_go;var str_pad_repeater=function(s,len){var collect='',i;while(collect.length<len){collect+=s;}
    collect=collect.substr(0,len);return collect;};input+='';pad_string=pad_string!==undefined?pad_string:' ';if(pad_type!='STR_PAD_LEFT'&&pad_type!='STR_PAD_RIGHT'&&pad_type!='STR_PAD_BOTH'){pad_type='STR_PAD_RIGHT';}
    if((pad_to_go=pad_length-input.length)>0){if(pad_type=='STR_PAD_LEFT'){input=str_pad_repeater(pad_string,pad_to_go)+input;}else if(pad_type=='STR_PAD_RIGHT'){input=input+str_pad_repeater(pad_string,pad_to_go);}else if(pad_type=='STR_PAD_BOTH'){half=str_pad_repeater(pad_string,Math.ceil(pad_to_go/2));input=half+input+half;input=input.substr(0,pad_length);}}
    return input;}
    function str_replace(e,t,n,r){var i=0,s=0,o="",u="",a=0,f=0,l=[].concat(e),c=[].concat(t),h=n,p=Object.prototype.toString.call(c)==="[object Array]",d=Object.prototype.toString.call(h)==="[object Array]";h=[].concat(h);if(r){this.window[r]=0}for(i=0,a=h.length;i<a;i++){if(h[i]===""){continue}for(s=0,f=l.length;s<f;s++){o=h[i]+"";u=p?c[s]!==undefined?c[s]:"":c[0];h[i]=o.split(l[s]).join(u);if(r&&h[i]!==o){this.window[r]+=(o.length-h[i].length)/l[s].length}}}return d?h:h[0]}
    function strstr(haystack,needle,bool){var pos=0;haystack+='';pos=haystack.indexOf(needle);if(pos==-1){return false;}else{if(bool){return haystack.substr(0,pos);}else{return haystack.slice(pos);}}}
    function uniqid(prefix,more_entropy){if(typeof prefix=='undefined'){prefix="";}
    var retId;var formatSeed=function(seed,reqWidth){seed=parseInt(seed,10).toString(16);if(reqWidth<seed.length){return seed.slice(seed.length-reqWidth);}
    if(reqWidth>seed.length){return Array(1+(reqWidth-seed.length)).join('0')+seed;}
    return seed;};if(!this.php_js){this.php_js={};}
    if(!this.php_js.uniqidSeed){this.php_js.uniqidSeed=Math.floor(Math.random()*0x75bcd15);}
    this.php_js.uniqidSeed++;retId=prefix;retId+=formatSeed(parseInt(new Date().getTime()/1000,10),8);retId+=formatSeed(this.php_js.uniqidSeed,5);if(more_entropy){retId+=(Math.random()*10).toFixed(8).toString();}
    return retId;}
    function ucwords(a){return preposicoes=["da","de","do","das","des","dos","e"],palavras=a.split(" "),result=new Array,i=0,$.each(palavras,function(a,b){result[i++]=0==a||$.inArray(b.toLowerCase(),preposicoes)<0?b.substring(0,1).toUpperCase()+b.substring(1).toLowerCase():b.toLowerCase()}),result.join(" ")}
    
    
    /**
     * Utilizado para garantir que o mesmo erro somente irá aparecer uma vez para cada elemento
     * 
     * @type String
     */
    erroAnterior    = '';
    
    
    /**
     * Variavel que será utilizada para captar e redistribuir todos os submits de formulários.
     * 
     * @type json
     */
    resultAjaxSubmit = '';
    
    
    /**
     * Informação global que garante que o serviço de seleção de imagem retornará os valores no campo correto
     * 
     * @type string
     */
    inputSelecionado = '';
    
    $(document).on("click", "#btn-menu", function () {
        $(".menu-principal").slideToggle();
        $("header #btn-menu span").toggleClass("muda-cor-btn-menu");
    });
    $(document).on('click', ".menu-principal a", function() {
        $(".menu-principal").hide();
        return false;
    });    
    
    
    /**
     * Todos os formulários deste sistema seguem este padrão
     *   -- Se houver formulário carregado então inicializa...
     */
    $(document).ready(function() {
        if ($("form").length >= 1) {
            initFormulario('#context');
        }
    });

    
    
    /**
     * Todos os formulários deste sistema seguem este padrão
     *   -- Se houver formulário carregado então inicializa...
     */
    if ($("form").length >= 1) {
        initFormulario('');
        _initMask(''); 
        _initAutomacao('');
    }


    /**
     * Função que irá iniciar o autocomplete para itens determinados do formulário
     * 
     * @param {string} [tipo]
     * @returns {void}
     */
    function _initAutocomplete(tipo) 
    {
        
    }

    
    /**
     * Função que irá iniciar as mascaras dos inputs do formulário
     * 
     * @param {type} [tipo]
     * @returns {void}
     */
    function _initMask(tipo) 
    {
        
    }


    /**
     * Função que inicia os procedimentos automáticos
     * 
     * @param {string} [tipo]
     * @returns {void}
     */
    function _initAutomacao(tipo) 
    {

    }
    

    /**
     * Função que retorna a data atual formatada.
     * 
     * @returns {string}
     */
    function _dataAtualVisita()
    {
        var data    = new Date();
        var dia     = (data.getDate().toString().length == 1) ? '0'+data.getDate() : data.getDate();
        var mes     = (data.getMonth().toString().length == 1) ? '0'+(data.getMonth()+1) : (data.getMonth()+1);
        var ano     = data.getFullYear();

        return ano+""+mes+""+dia;
    };
    
    
    /**
     * Função que irá simplesmente preencher os campos de um formulário 
     * de acordo com as chaves do array
     * 
     * @param {array} data
     * @returns {void}
     */
    function populateForm(data)
    {
        var chaves = Object.keys(data);

        for (var i in chaves) {
            $("#"+ chaves[i]).val(data[chaves[i]]);
        }
    }

    /**
     * Faz com que os formulários sejam mais organizados, podendo ter formulário com campos lado a lado
     * -- Para evitar consumo de recurso ele sempre verifica se existe formulário...
     *
     * @param {string} [tipo] #context|#systemModal
     */
    function initFormulario(tipo)
    {
        var initNav = false,
            loopNav = 0,
            contNav = 0,
            ie68    = ($("ie6, .ie7, .ie8").length >= 1 ? true : false);

        $.each($(tipo+" fieldset"), function(ev, el) {
            var idElement   = $(this).attr("id"),
                type        = idElement.split("_")[0].split("-")[1].replace(/[0-9]/g, ''),      //-- String - Nav ou Group
                id          = idElement.split("_").splice(1, idElement.split("_").length),      //-- Array
                idNav       = idElement.split("_")[0].split("-")[1].replace(/[A-Za-z$-]/g, ''), //-- String - ID Atual
                nameNav     = $(this).attr("data-label"),                                       //-- String - Nome no navigator
                contentNav  = '';                                                               //-- String - Pega o conteúdo modificado para inserir no navigator

            for (var i in id) {
                if (type === 'group') {
                    $(tipo+" #"+idElement).find("div.form-group").eq(i).wrap('<div class="col-sm-'+ id[i] +'" />');

                } else if (type === 'nav') {
                    // Inicializa o sistema de navs do bootstrap
                    if (initNav === false && !ie68) {
                        $(tipo+" div.form-group:last").prepend('<ul class="nav nav-tabs" style="margin-top: 10px;" />');
                        $(tipo+" .nav.nav-tabs").after('<div class="tab-content" />');
                        initNav = true;
                    }

                    // Insere uma nav-tabs e uma div correspondente para o mesmo...
                    if ($(tipo+" #tab"+idNav).length === 0) {
                        ++contNav;
                        $(tipo+" .nav.nav-tabs").append('<li class="'+ ((contNav === 1) ? 'active' : '') +'"><a href="#tab'+ (idNav) +'" data-toggle="tab">'+ nameNav +'</a></li>')
                        $(tipo+" .tab-content").append('<div class="tab-pane '+ (contNav === 1 ? 'active' : '') +'" id="tab'+ (idNav) +'" />');
                    }

                    // Salva o conteúdo criado em uma variável....
                    contentNav += $(tipo+" #"+idElement).find("div.form-group").eq(i).wrap('<div class="col-sm-'+ id[i].replace(/[A-Za-z$-]/g, '') +'" />').parent().wrap('<div />').parent().html();

                    // Insere o conteúdo no menu-inferior
                    if (id[i].substr(-1) === 'f') {
                        $(tipo+" #tab"+idNav).append('<div class="row">'+ contentNav +'</div>');
                        contentNav = '';
                    }

                    // Verifica se o conteúdo foi completamente replicado, e reinicializa as contagens
                    if (++loopNav === id.length) {
                        loopNav     = 0;
                        contentNav  = '';

                        // Remove o conteúdo anterior somente se não for IE8
                        if (!ie68) {
                            $(this).remove();
                        }
                    }
                }
            }
        });

        _initAutocomplete(tipo);
        _initMask(tipo);
        _initAutomacao(tipo);      
    }
    

    /**
     * Função que retorna uma cor aleatória
     * 
     * @returns {String}
     */
    function _getRandomColor() {
        var letras = '0123456789ABCDEF'.split(''),
            cor     = '#';
        
        for (var i = 0; i < 6; i++ ) {
            cor += letras[Math.floor(Math.random() * 16)];
        }
        
        return cor;
    }
        
    /**
     * Exibe o pardão de carregando... 
     * 
     * @param {string} [msg]
     * @returns {undefined}
     */
    function exibirTarjaAjax(msg) 
    {
        $("body").prepend('<div class="ajaxCarregando"></div>');
        $(".ajaxCarregando").html(msg).show();
    }
    

    /** 
     * Mensagem de carregando quando houver requisições em ajax 
     */
    $.ajaxSetup({
        timeout: 0,
        error: function(xhr, status, error) {
            console.log("An AJAX error occured: " + status + "\nError: " + error);
            $(".ajaxCarregando").remove();
        }
    });


    /** 
     * Função de fazer com que o sistema informe que esta havendo uma requisição ajax 
     */
    $(document).ajaxSend(function () {
        exibirTarjaAjax('');

    }).ajaxStop(function(){
        $(".ajaxCarregando").remove();
    });    
    
    
    /**
     * Função que irá automatizar os botões que possuirem ID igual a btnEnviar
     *   -- O envio é via ajax e o retorno é json tratado por esta classe
     * 
     * @return false
     */
    $(document).on("click", "#btnEnviar", function() {
        try {
            var formId  = $(this).parents('form').attr('id'),
                tipo    = $("#"+formId).attr('action').split('/')[3],
                self    = this;

            $(self).button('loading');
            resultAjaxSubmit = ajaxSubmit(formId);

            $.when(resultAjaxSubmit).then(function(r) {
                if (typeof r !== 'undefined') {
                    if (r['type'] === 'success' && tipo !== 'editar') {
                        $("#"+formId +' :input').not(':button, :submit, :reset, :hidden').val('')
                                                .removeAttr('checked')
                                                .removeAttr('selected');
                    }
                    $("html, body").animate({scrollTop:100},"slow");
                }
                $(self).button('reset');                    
            });

            // Evitar que o botão submeta o formulário...
            return false;
        
        } catch (e) {
            $(this).button('reset');
            console.log('Houve um erro interno na função de envio de formulários #btnEnviar. '+e);
        }         
    });
    
    
    /**
     * função chave para o processo de envio de dados do formulário via ajax e resposta json.
     *
     * @param {string} [formName] Informar apenas o id do formulário, NÃO o objeto formulário
     * @param {string} [succ]
     * @return {json} [data]
     */
    function ajaxSubmit(formName)
    {
        var url     = $("#"+formName).attr('action'),
            dados   = $("#"+formName).serialize();

        // Remove os antigos erros do formulário e cria padrão de mensagem do servidor
        removerErrosFormulario();
        inserirMensagemSistema(formName);

        // Verifica se a forma de enviar o conteúdo é via post ou via formAjaxSubmit
        if (typeof $("form#"+formName).find('input:file').get(0) === "undefined") {
            return submitInfoFormAjax(url, dados, formName);

        // Método especial para formulários com arquivos
        } else {
            submitFormFileAjax(formName);
        }
    };
    
    
    /**
     * Função que irá simplesmente preencher os campos de um formulário 
     * de acordo com as chaves do array
     * 
     * @param {array} data
     * @returns {void}
     */
    function populateForm(data)
    {
        var chaves = Object.keys(data);

        for (var i in chaves) {
            $("#"+ chaves[i]).val(data[chaves[i]]);
        }
    }
    

    /**
     * Sempre que um formulário for submetido é interessante remover os erros para que seja feita uma nova análise
     * -- Remove os erros da página inteira, se houver outra necessidade esta função deverá ser atualizada...
     * 
     * @returns {void}
     */
    function removerErrosFormulario() 
    {
        $("ul[id^='errors-']").remove();
        $(".form-group.has-error").removeClass('has-error');
    }


    /**
     * Coloa a mensagem do sistema em cima do formulário. Informando se tudo ocorreu corretamente ou se houve algum problema
     * -- Esta mensagem será preenchida com informações do servidor, nunca na tela do usuário...
     * 
     * @param {string} formName
     * @returns {void}
     */
    function inserirMensagemSistema(formName) 
    {
        // Verifica se a mensagem do sistema já foi criada na tela do usuário...
        if (typeof $(".msgSystemAlert").get(0) === 'undefined') {
            $('<div class="msgSystemAlert collapse"><div class="alert"><button type="button" data-toggle="collapse" data-target=".msgSystemAlert" class="close">&times;</button><p></p></div></div>').prependTo("#"+formName);
        }
    }

    
    /**
     * Função chamada pelo ajaxsubmit ou por outra função cujo o interesse seja enviar informações via POST 
     * e retornar erros do formulário através do servidor.
     * -- Esta função irá 
     * 
     * @param {string} [url]
     * @param {object} [dados]
     * @param {object} [formName] Obrigatório, pois haverá validação do formulário no servidor
     *                            Se nao tiver formulário, utilize o $.post...
     * @returns {mixed}
     */
    function submitInfoFormAjax(url, dados, formName) 
    {
        // Envia os dados do formulário para o servidor.
        return $.post(url, dados, function(resp) {
            defaultValidations(formName, resp);
        }, "json");
    }


    /**
     * Função que submete informações de um formulário com arquivo anex via "ajax" (não é ajax de verdade)
     *
     * @param {string} formName
     * @returns {mixed}
     */
    function submitFormFileAjax(formName)
    {
        $("#"+formName).iframePostForm({
            post : function() {
                exibirTarjaAjax('Carregando, aguarde...');
            },
            complete : function (response) {
                resp = response.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;">', '').replace('<pre>', '').replace('</pre>', '');
                resp = $.parseJSON(resp);
//                console.log(resp);

                defaultValidations(formName, resp);

                $("#iframe-post-form").remove();
                $(".ajaxCarregando").remove();
            },
            iframeID: 'iframe_'+ Math.floor((Math.random()*100)+1) +'_'+ Math.floor((Math.random()*100)+1)
        }).submit();
    }
    
    
    /**
     * Este sistema possui um padrão próprio de validação de formulários via ajax.
     * -- Este padrão poderá ser utilizado em qualquer submissão ajax que receba retorno
     * -- Útil em formulários de envio de arquivos com necessidade de retorno de informações
     * 
     * @param {string} [formName] Id do form
     * @param {string} [resp] Geralmente é o resultado do servidor com base no formulário enviado
     * @returns {void}
     */
    function defaultValidations(formName, resp) 
    {
        // Prepara as informaçoes e o formulário...
        inserirMensagemSistema(formName);
        removerErrosFormulario();

        // Verificar se houve erro na inclusão das informações.
        if (resp.type === 'success') {
            // Mensagem de sucesso!
            $(".msgSystemAlert").addClass('in').removeAttr('style').children().removeClass('bg-danger').addClass('bg-success').find('p').html(resp.flashMsg);

        } else {
            // Insere os erros do formulário, caso exista...
            insertInputError(formName, resp);

            // Mensagem de Erro!
            $(".msgSystemAlert").addClass('in').removeAttr('style').children().removeClass('bg-success').addClass('bg-danger').find('p').html(resp.flashMsg);
        }
    }


    /**
     * Injeta a mensagem de erro no formulário especificado nos campos encontrados.
     * 
     * @param {string} [formName] Id do form
     * @param {string} [resp] Geralmente é o resultado do servidor com base no formulário enviado
     * @returns {void}
     */
    function insertInputError(formName, resp) 
    {
        try {
            // Busca os componentes do formulário que foram validados no servidor.
            $("#"+formName).find("input, textarea, select, radio, checkbox").each(function() {
                var inputType   = $(this).attr('type'),
                    inputId     = $(this).attr('id'),
                    inputName   = $(this).attr('name'),
                    inputClear  = inputType === 'checkbox' || $(this).attr('multiple') === 'multiple' ? inputName.substr(0, inputName.length-2) : inputName;

                // Remove os erros já reportados, para que sejam validados novamente...
                $("#"+formName+" #" + inputId).parent().find('.errors').remove();

                // Verifica se houve erros e para cada compontente invalidado coloca o erro
                if (typeof resp.erros !== 'undefined') {
                    $("#"+formName+" [name^='"+ inputName +"']").closest('.form-group').last().append( getErrorHtml(resp.erros[inputClear], inputClear) );
                    $("ul.errors li").closest('.form-group').addClass('has-error');
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
    

    /**
     * Função que reproduz os erros no formulário.
     * Gerando os li que ficarão em baixo do input com problema.
     *
     * @param {string} [formErrors]
     * @param {string} [input]
     * @return {html.tag} [erros]
     */
    function getErrorHtml( formErrors, input )
    {   
        try {
            var erros        = '<ul id="errors-'+input+'" class="errors">',
                erroAnterior = '';

            for (var i in formErrors) {
                if (i+'-'+input !== erroAnterior) {
                    erros += '<li>' + formErrors[i] + '</li>';
                }
                erroAnterior = i+'-'+input;
            }

            erros += '</ul>';

            return erros;

        } catch (e) {
            console.log('Erro ao gerar erros nos inputs. Erro: '+ e);
        }
    }


    /**
     * Função que valida o imput específico do formulário. TODOS os erros do formulário serão
     * passados via json, porém, a função fica encarregada de gerar apenas os erros do input.focusout
     * Muito útil para utilizar junto com focusout
     *
     * @param {string} [formName]
     * @param {string} [link]
     * @param {string} [input]
     */
    function validarInputs(formName, input, link)
    {
        var url     = link;
        var dados   = $("#"+formName).serialize();

        $.post(url, dados, function(data)
        {
            $("#"+input).parent().find('.errors').remove();
            if (typeof data.erros !== 'undefined') {
                $("#"+input).parent().append(this.getErrorHtml(data.erros[input], input ));
            }
        }, "json");
    }
    
    
    
    
    /**
     * jQuery plugin for posting form including file inputs.
     * 
     * Copyright (c) 2010 - 2011 Ewen Elder
     *
     * Licensed under the MIT and GPL licenses:
     * http://www.opensource.org/licenses/mit-license.php
     * http://www.gnu.org/licenses/gpl.html
     *
     * @author: Ewen Elder <ewen at jainaewen dot com> <glomainn at yahoo dot co dot uk>
     * @version: 1.1.1 (2011-07-29)
     **/
    !function(a){a.fn.iframePostForm=function(b){var c,d,e,g,f=!0;return b=a.extend({},a.fn.iframePostForm.defaults,b),a("#"+b.iframeID).length||a("body").append('<iframe id="'+b.iframeID+'" name="'+b.iframeID+'" style="display:none" />'),a(this).each(function(){e=a(this),e.attr("target",b.iframeID),e.submit(function(){return f=b.post.apply(this),f===!1?f:(g=a("#"+b.iframeID).load(function(){c=g.contents().find("body"),d=b.json?a.parseJSON(c.html()):c.html(),b.complete.apply(this,[d]),g.unbind("load"),setTimeout(function(){c.html("")},1)}),void 0)})})},a.fn.iframePostForm.defaults={iframeID:"iframe-post-form",json:!1,post:function(){},complete:function(){}}}(jQuery);
    
    

    /**
     * Função utilizada para remover acentos de palavras
     * 
     * @param string palavra
     */
    function removerAcento(palavra) 
    {  
        str_acento      = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";  
        str_sem_acento  = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";  
        novaPalavra     = "";  

        for (var i = 0; i < palavra.length; i++) {
            if (str_acento.indexOf(palavra.charAt(i)) != -1)
                novaPalavra += str_sem_acento.substr(str_acento.search(palavra.substr(i,1)),1);  
            else
                novaPalavra += palavra.substr(i,1);  
        }  

        return novaPalavra;  
    }    
    