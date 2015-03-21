module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        /**
         * 清空任务
         */
        clean: {
            options: {
                force: true
            },
            main: '<%= config.destDir%>',
            part:[
                "<%= config.destDir %>/*", 
                "!<%= config.destDir %>/libs.js",
                "!<%= config.destDir %>/main.js",
                "!<%= config.destDir %>/res",
            ]
        },
        "copy": {
            "main": {
                flatten: true,
                "src": "<%= config.srcDir %>/config.js"
            },
            'template': {
                "files": [{
                    "expand": true,
                    "cwd": "<%= config.srcDir %>",
                    "src": ["**/*.html", "res/**/*.*"],
                    "dest": "<%= config.destDir %>"
                }]
            }
        },

        "strip": {
            "main": {
                "src": "<%= config.destDir %>/**/*.js",
                "options": {
                    "inline": true
                }
            }
        },
        /**
         * css 迷你化任务
         */
        "cssmin": {
            //css 迷你化
            "minify": {
                "expand": true,
                "cwd": "<%= config.srcDir %>/res/style",
                "src": ["*.css"],
                "dest": "<%= config.destDir %>/res/style/"
            }
        },
        //requireJS没有包含的文件也需要移过去
        "uglify": {
            "main": {
                "options": {
                    "report": "false",
                    "mangle": {
                        "except": ['$super']
                    }
                },
                "files": [{
                    "expand": true,
                    "cwd": "<%= config.srcDir %>",
                    "src": "**/*.js",
                    "dest": "<%= config.destDir %>"
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-strip');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', 'default task', function() {
        var pkg = grunt.file.readJSON('package.json');
        var t = pkg.channels;
        var tasks = [],
            k, v, item;
        for (k in t) {
            v = t[k];
            item = 'Avatar:' + k
            tasks.push(item)
        }

        grunt.task.run(tasks);

    });

    grunt.registerTask('Avatar', 'pack h5', function(channel) {
        //默认打框架包
        if (!channel) channel = 'app';

        var pkg = grunt.file.readJSON('package.json');
        var cfg = grunt.file.readJSON(pkg.channels[channel].src + '/gruntcfg.json');

        var config = {
            srcDir: pkg.channels[channel].src,
            destDir: pkg.channels[channel].dest
        };

        grunt.config.set('config', config);


        grunt.log.debug('参数：' + JSON.stringify(cfg.requirejs, null, 2));


        grunt.config.set('requirejs', cfg.requirejs);

        grunt.task.run(['clean:main', 'uglify', 'requirejs', 'copy:template', 'strip','cssmin','clean:part']);


    });


}