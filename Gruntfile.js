/*
 * grunt-kiosk
 * https://github.com/oh4real/grunt-kiosk
 *
 * Copyright (c) 2014 David Byrd
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        copy: {
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/fixtures',
                    src: ['*/*.html'],
                    dest: 'tmp/'
                }, ]
            }

        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        kiosk: {
            testApp: {
                dest: 'tmp/app',
                interval: 8001,
                version: 'test',
                init: true
            },
            testNoApp: {
                dest: 'tmp/no-app',
                interval: 8002,
                version: 'test',
                init: true
            },
            testDist: {
                dest: 'tmp/dist',
                interval: 8003,
                version: 'test'
            },
            testNoDist: {
                dest: 'tmp/no-dist',
                interval: 8004,
                version: 'test'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy:test', 'kiosk', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};