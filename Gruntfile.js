/**
 * Using Grunt to make a dynamically loaded site become fully
 * static, without any includes.
 *
 * Development path: /web
 * Production path: /dist/web
 */
module.exports = function(grunt) {
    'use strict';

    // Create the project object for easier editing
    grunt.initConfig({
        // Read the package file
        pkg: grunt.file.readJSON('package.json'),

        // Settings for the project paths
        project: {
            assets: 'master/public',
            css: '<%= project.assets %>/css',
            scss: '<%= project.assets %>/scss',
            js: '<%= project.assets %>/js'
        },

        /**
         * Setup notifications to be run after certain tasks have been
         * completed, so we know when things are done.
         */
        notify: {
            watchsass: {
                options: {
                    title: 'Grunt run successfully',
                    message: 'Grunt watch SASS task has finished running'
                }
            },
            watchjs: {
                options: {
                    title: 'Grunt run successfully',
                    message: 'Grunt watch JS task has finished running'
                }
            },
            build: {
                options: {
                    title: 'Grunt build complete',
                    message: 'All tasks have been run successfully'
                }
            }
        },

        /**
         * Banner to be added to all Javascript and CSS
         * files with the option set to display the banner
         */
        tag : {
            banner: '/*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @version <%= pkg.version %>\n' +
                ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
                ' */\n'
        },

        /**
         * SASS compiler will be on the watcher and will look
         * for changes in project *.scss files. It will then
         * move them into the css folder for the distribution
         */
        sass: {
            dist: {
                options: {
                    banner: '<%= tag.banner %>'
                },
                files: {
                    '<%= project.css %>/styles.css' : '<%= project.scss %>/main.scss'
                }
            }
        },

        /**
         * JSHint is important to keep our Javascript consistent and
         * strict. The options should be configured to suit the dev
         * team style
         */
        jshint: {
            files: ['<%= project.js %>/*.js'],
            options: {
                globals: {
                    "$": true,
                    "jQuery": true,
                    "console": true,
                    "module": true,
                    "document": true,
                    "window": true
                }
            }
        },

        /**
         * This watch task will keep Grunt idle until one of the files
         * in the file array for each task is modified, and then it will
         * run the tasks from the task array
         */
        watch: {
            sass: {
                files: '<%= project.scss %>/**/*',
                tasks: ['sass:dist', 'notify:watchsass'],
                options: {
                    livereload: 35729
                }
            },
            js: {
                files: '<%= project.js %>/**/*',
                tasks: ['jshint', 'notify:watchjs'],
                options: {
                    livereload: 35729
                }
            }
        }
    });

    /**
     * Load Grunt plugins
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * Default task
     */
    grunt.registerTask('default', [
        'watch'
    ]);

    /**
     * Build task, concat everything into dist folder
     */
    grunt.registerTask('build', [
        'jshint',
        'sass:dist',
        'notify:build'
    ]);
};