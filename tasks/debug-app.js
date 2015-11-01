module.exports = function(grunt) {
  'use strict'

  var electron = require('electron-prebuilt');
  var proc = require('child_process');
  var open = require("open");

  grunt.registerTask('debug-app', 'Starts an electron app ready to debug with node inspector', function(buildOption) {
    var buildOptions, done, options;

    buildOptions = grunt.option('buildOptions');

    done = this.async();

    grunt.log.subhead('Starting '+ buildOptions.applicationName + ' in debug mode\n');
    grunt.log.writeln('Stand up, take a quick stretch, maybe get some water');
    grunt.log.writeln('Node inspector will start, but it can take some time to connect\n');

    var debuggerProcess;
    var electronProcess;
    var remoteDebugger;

    if(process.platform === 'win32') {
      debuggerProcess = proc.exec('node-inspector');
      electronProcess = proc.spawn(electron, ['--debug=5858' ,'main.js']);
      remoteDebugger = open('http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858', 'chrome')
    }else {
      debuggerProcess = proc.spawn('node-inspector');
      electronProcess = proc.spawn(electron, ['--debug=5858' ,'main.js']);
      remoteDebugger = open('http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858', 'google chrome')
    }

    electronProcess.stdout.on('data', function (x) { grunt.log.writeln('[electron] ' + x);});
    debuggerProcess.stdout.on('data', function (x) { grunt.log.writeln(x);});

    electronProcess.stderr.on('data', function (x) {grunt.log.warn('[electron] ' + x);});
    debuggerProcess.stderr.on('data', function (x) { grunt.log.warn(x);});

    electronProcess.on('close', function (code) {
      grunt.log.ok('Electron process exited with code ' + code);

      if(debuggerProcess){
        debuggerProcess.disconnect();
      }

      done();
    });

  });
};
