# grunt-kiosk

> Use this Grunt plugin to enable auto-refresh for apps running in kiosk mode when a new version is published.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-kiosk --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-kiosk');
```

## The "kiosk" task

### Overview
In your project's Gruntfile, add a section named `kiosk` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    kiosk: {
        options: {},
        app: {
            dest: '<%= yeoman.app %>',
            interval: 5000,
            version: 0
        },
        dist: {
            dest: '<%= yeoman.dist %>',
            interval: 3600 * 1000,
            version: 1.1,
            clean: true
        }
    },
});
```

### Options

#### options.dest
Type: `String`
Default value: `'app'`

A string value that is used to do define the path the index.html you want modified. This is typically set to 'app' or 'dist'. Maybe 'build' if your build has that staging area.

### options.version
Type: `String`
Default value: `'0'`
Argument: First optional argument when calling the task.

A string value that you can use to indicate a major change and is primarily for internal consumption. The plugin will append a millisecond timestamp to the end of this property.

If this option is passed in as first argument, it will override all initConfig options set:

```
  grunt kiosk:target:MY_REV
```

### options.clean
Type: `Boolean`
Default: false

When set to true, the plugin will scrub the `<!-- kiosk -->...<!-- endkiosk -->` wrapping comment blocks. This is how you can clean up a dist version to reduce size.  

Since the wrapping comment blocks are needed for targeting, the plugin will not work if set clean to true on app/index.html.

#### options.interval
Type: `Integer` as milliseconds
Default value: `3600000` or one hour
Argument: Second optional argument when calling the task.

This is used to set the interval between version checks. If this option is passed in as second argument, it will override all initConfig options set

```
  // check every 60 seconds 
  grunt kiosk:target::60000
```

### Usage Examples

#### Default Options
You may set default options that all targets can inherit.

```js
grunt.initConfig({
  kiosk: {
    options: {
            dest: 'app',
            interval: 8675,
            version: 0.1,
            clean: false
          },
    target1: {
       {
            dest: 'alt-app',
            version: 'a',
            clean: true
          },
    },
  },
});
```

The final option values used above for target1 would be:
```js
      {
        dest: 'alt-app',
        interval: 8675,
        version: 'a',
        clean: true
      }
```
NOTE: version and interval can be further overridden when specified on execution: grunt kiosk:target4:0.2.3:9999

### Initializing the plugin in your SPA's index.html

You are required to add the kiosk comment block to the `<head>` or `<body>` element for the inline script to be added. Then you should run the kiosk task to get the script tag inserted in your source index.html as well as adding a grunt-kiosk-version.js file.  

While running the kiosk plugin on app is not required to run, it is advised to insure there are no namespace or other conflicts.

1. (Required) Add the following to the index.html head or body tags.
```html
<head>
<!-- kiosk --><!-- endkiosk -->
</head>
```
2. (Optional, but strongly recommended) Run the kiosk task with a short interval. The interval can be set when you run it or as a config.
```shell
grunt kiosk:app:MY_REV:5000
```

#### Implementing plugin on 'grunt build'

Assuming you added a kiosk.dist to the initConfig with dest set to your dist directory, simply add `kiosk:dist` to your build task like so:

```js
    grunt.registerTask('build', [
        'clean:dist',
        ...
        'copy:dist',
        'kiosk:dist',
        'cdnify',
        'cssmin',
        ...
    ]);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
