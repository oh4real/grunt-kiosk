'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var versionRegex = /(currentKioskVersion \= currentKioskVersion \|\| loadedKioskVersion)(\n|\r|.)*?(currentKioskVersion \!\=\= loadedKioskVersion \&\& window\.location\.reload\(\))/gi;
exports.kiosk = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    testApp: function(test) {
        // index.html probing
        var indexHtml = grunt.file.read('tmp/app/index.html');
        test.ok(indexHtml.match(/(<script id\=\"grunt-kiosk-interval\")(\n|\r|.)+(<\/script>)/gi), 'Index.html has a grunt-kiosk-internal script tag');
        test.ok(indexHtml.match(/(([ \t]*)<!--\s*kiosk*(\S*)\s*--><script id\=\"grunt-kiosk-interval\")(\n|\r|.)+(<!--\s*endkiosk\s*-->)/gi), 'Index.html has a kiosk wrapping section with content');
        test.ok(indexHtml.match(/appendChild\(t\)},8001\)/gi), 'Correct interval value was set');
        test.notEqual(grunt.file.read('test/fixtures/app/index.html'), indexHtml, 'Index.html has been modified');

        // grunt-kiosk-version.js probing
        test.ok(grunt.file.exists('tmp/app/grunt-kiosk-version.js'), 'Version.js file was written');
        var versionjs = grunt.file.read('tmp/app/grunt-kiosk-version.js');
        test.ok(versionjs.match(versionRegex), 'The version.js file has the current and loaded snippet');
        test.done();
    },
    testDist: function(test) {
        // index.html probing
        var indexHtml = grunt.file.read('tmp/dist/index.html');
        test.ok(indexHtml.match(/(<script id\=\"grunt-kiosk-interval\")(\n|\r|.)+(<\/script>)/gi), 'Index.html has a grunt-kiosk-internal script tag');
        test.ok(!indexHtml.match(/(([ \t]*)<!--\s*kiosk*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endkiosk\s*-->)/gi), 'Index.html has NO kiosk wrappers');
        test.ok(indexHtml.match(/appendChild\(t\)},8003\)/gi), 'Correct interval value was set');

        // grunt-kiosk-version.js probing
        test.ok(grunt.file.exists('tmp/dist/grunt-kiosk-version.js'), 'Version.js file was written');
        var versionjs = grunt.file.read('tmp/app/grunt-kiosk-version.js');
        test.ok(versionjs.match(versionRegex), 'The version.js file has the current and loaded snippet');
        test.done();
    },
    testNoApp: function(test) {
        // index.html probing
        var indexHtml = grunt.file.read('tmp/no-app/index.html');
        test.equals(grunt.file.read('test/fixtures/no-dist/index.html'), grunt.file.read('tmp/no-app/index.html'), 'Index.html file was not changed.');

        // grunt-kiosk-version.js probing
        test.ok(!grunt.file.exists('tmp/no-app/grunt-kiosk-version.js'), 'Version.js file was NOT written');
        test.done();
    },
    testNoDist: function(test) {
        // index.html probing
        var indexHtml = grunt.file.read('tmp/no-dist/index.html');
        test.equals(grunt.file.read('test/fixtures/no-dist/index.html'), grunt.file.read('tmp/no-dist/index.html'), 'Index.html file was not changed.');

        // grunt-kiosk-version.js probing
        test.ok(!grunt.file.exists('tmp/no-dist/grunt-kiosk-version.js'), 'Version.js file was NOT written');
        test.done();
    }
};