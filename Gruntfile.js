module.exports = function(grunt) {
  'use strict';

  var buildOptions = require('./config.json');

  grunt.option('buildOptions', buildOptions);

  grunt.initConfig({
    clean: {
      builds: [buildOptions.buildsDirectory]
    },

    'create-windows-installer': {
      x64: {
        appDirectory: 'builds/'+ buildOptions.applicationName +'-win32-x64',
        outputDirectory: buildOptions.releaseDirectory + '/win32/' + buildOptions.applicationName + '-setup',
        authors: buildOptions.authors,
        exe: buildOptions.applicationName + '.exe',
        remoteReleases: buildOptions.windowsUpdateUrl
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-electron-installer');
  grunt.loadTasks('./tasks');

  grunt.registerTask('createDistributables', [
    'create-windows-distributable',
    'create-darwin-distributable',
    'create-linux-distributable']);

  grunt.registerTask('release', [
    'package',
    'release-windows-distributable',
    'release-darwin-distributable',
    'release-linux-distributable'])

  grunt.registerTask('package', [
     'clean',
     'buildPackages',
     'createDistributables']);

   grunt.registerTask('build', [
      'clean',
      'buildPackages']);

  grunt.registerTask('debug', ['debug-app']);

  grunt.registerTask('default', ['build']);
};
