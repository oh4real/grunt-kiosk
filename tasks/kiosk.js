/*
 * grunt-kiosk
 * https://github.com/oh4real/grunt-kiosk
 *
 * Copyright (c) 2014 David Byrd
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask('kiosk', 'Use this Grunt plugin to enable auto-refresh for apps running in kiosk mode when a new version is published.', function(version, time) {
        // default interval will be hourly
        var target = this.target,
            dest = this.data.dest || this.options().dest || 'app',
            interval = time || this.data.interval || this.options().interval || 3600 * 1000,
            rev = [version || this.data.version || this.options().version || '0', Date.now()].join('.'),
            kioskRegex = /(([ \t]*)<!--\s*kiosk*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endkiosk\s*-->)/gi,
            contents = [
                '"use strict"',
                'var loadedKioskVersion = "###",',
                'currentKioskVersion = currentKioskVersion || loadedKioskVersion',
                'currentKioskVersion !== loadedKioskVersion && window.location.reload()'
            ].join('\n').replace('###', rev),
            kiosk = [
                '<!-- kiosk --><script id="grunt-kiosk-interval" type="text/javascript">',
                '!function(){window.setInterval(function(){var e=document.getElementById("grunt-kiosk")',
                'e&&document.getElementsByTagName("body")[0].removeChild(e)',
                'var t=document.createElement("script")',
                't.id="grunt-kiosk",t.src="grunt-kiosk-version.js",t.type="text/javascript",document.getElementsByTagName("body")[0].appendChild(t)},###)}()',
                '</script><!-- endkiosk -->'
            ].join('\n').replace('###', interval);

        if (this.data.clean) {
            kiosk = kiosk.replace(/<!--\s(end)?kiosk\s-->/gi, '');
        }

        var process = function(dir) {
            if (grunt.file.exists(dir + '/index.html')) {
                var str = grunt.file.read(dir + '/index.html');
                if (str.match(kioskRegex)) {
                    grunt.file.write(dir + '/index.html', str.replace(kioskRegex, kiosk));
                    grunt.file.write(dir + '/grunt-kiosk-version.js', contents);
                    logoutput();
                }
            }
        };
        var logoutput = function() {
            grunt.log.write('Kiosk Version added: ' + 'The rev used is: ' + rev + '\n' + 'The interval used is: ' + interval + 'ms\n');
        };
        process(dest);
    });
};