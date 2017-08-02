module.exports = function (grunt) {
    
    grunt.initConfig({
        concat: {
            css: {
                src: [
                    "./www/js/library/bootstrap/dist/css/bootstrap.min.css",
                    "./www/js/modules/default/layouts/css/estilos.css"
                ], 
                dest: "./www/js/library/compile-css.css"
            },            
            header: {
                src: [
                    "./www/js/library/jquery/dist/jquery.min.js",                
					"./www/js/library/bootstrap/dist/js/bootstrap.min.js",
                    "./www/js/library/jquery/jquery.mask.min.js"
                ],
                dest: "./www/js/library/compile-header.js"
            },
            footer: {
                src: [
                    "./www/js/library/angular/angular.min.js",
                    "./www/js/library/angular-resource/angular-resource.min.js",
					"./www/js/library/angular-route/angular-route.min.js",
					"./www/js/library/angular-sanitize/angular-sanitize.min.js"
                ],
                dest: "./www/js/library/compile-footer.js"
            },
            ng: {
                src: [
                    './www/js-min/modules/mobileapp/configs/app.js',
                    './www/js-min/modules/mobileapp/services/Services.js',
                    './www/js-min/modules/mobileapp/controllers/Controllers.js',
                    './www/js-min/modules/mobileapp/configs/routes.js'
                ],
                dest: "./www/js-min/modules/mobileapp/production.js"                
            }
        },
        
        
        cssmin: {
            csscompiled: {
                files: {
                    src: './www/js/library/compile-css.css',
                    dest: './www/js/library/compile-css.css'
                }
            }
        },
        
        
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './www/js-min/modules/mobileapp/configs/app.js': [
                        './www/js/modules/mobileapp/configs/app.js'
                    ],
                    './www/js-min/modules/mobileapp/services/Services.js': [
                        './www/js/modules/mobileapp/services/BaseService.js',
                        './www/js/modules/mobileapp/services/ImagemService.js',
                        './www/js/modules/mobileapp/services/LayoutService.js',
                        './www/js/modules/mobileapp/services/UtilsService.js'
                    ],
                    './www/js-min/modules/mobileapp/controllers/Controllers.js': [
                        './www/js/modules/mobileapp/controllers/HomeController.js',
                        './www/js/modules/mobileapp/controllers/MainController.js',
                        './www/js/modules/mobileapp/controllers/MensagensController.js'
                    ],
                    './www/js-min/modules/mobileapp/configs/routes.js': [
                        './www/js/modules/mobileapp/configs/routes.js'
                    ]                      
                }
            }
        },
        
        
        uglify: {
            ng1: {
                src: ['./www/js/modules/mobileapp/production.js'],
                dest: './www/js/modules/mobileapp/production.js'
            },
            ng2: {
                src: ['./www/js/modules/mobileapp/functions/Development.js'],
                dest: './www/js-min/modules/mobileapp/functions.js'
            },
            ng4: {
                src: ['./www/js/library/compile-footer.js'],
                dest: './www/js-min/modules/mobileapp/compile-footer.js'
            }                      
        },
        
        
        remove: {
            ng1: {
                options: {
                    trace: true
                },
                fileList: [],
                dirList: [
                    './www/js-min/modules/mobileapp/configs/',
                    './www/js-min/modules/mobileapp/controllers/',
                    './www/js-min/modules/mobileapp/services/'                
                    ]
            }
        },
        
        
        exec: {
            initCordova: {
                command: 'cordova run browser',
                stdout: false,
                stderr: false
            }
        }        
    });
    
    grunt.registerTask('default', ['concat', 'cssmin']);
    grunt.registerTask('ng', ['ngAnnotate', 'concat', 'uglify:ng1', 'uglify', 'remove:ng1', 'exec:initCordova']);
    
	grunt.loadNpmTasks('grunt-minified');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-remove');
    grunt.loadNpmTasks('grunt-exec');
};