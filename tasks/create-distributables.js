module.exports = function(grunt) {
  'use strict'

  grunt.registerTask('create-windows-distributable', 'Builds a distributable for Windows', function() {
    var buildOptions, done;
    buildOptions = grunt.option('buildOptions');

    if(process.platform !== 'win32'){
      grunt.log.warn('Skipping creating win32 distributable because the current platform is not win32');
      return;
    }

    if(buildOptions.platform == 'all' || buildOptions.platform == 'win32'){
      grunt.task.run('create-windows-installer:x64');
    }
  });

  grunt.registerTask('create-linux-distributable', 'Builds a distributable for Linux', function() {
    var buildOptions = grunt.option('buildOptions');

    if(process.platform !== 'linux'){
      grunt.log.warn('Skipping creating linux distributable because the current platform is not linux');
      return;
    }

    if(buildOptions.platform == 'all' || buildOptions.platform == 'linux'){
      grunt.log.writeln('Creating '+ buildOptions.name +' Linux distributable not implemented');
    }
  });

  grunt.registerTask('create-darwin-distributable', 'Builds a distributable for Darwin', function() {
    var buildOptions = grunt.option('buildOptions');

    if(process.platform !== 'darwn'){
      grunt.log.warn('Skipping creating darwin distributable because the current platform is not darwin');
      return;
    }

    if(buildOptions.platform == 'all' || buildOptions.platform == 'darwin'){
      grunt.log.writeln('Creating '+ buildOptions.name +' darwn distributable not implemented');
    }
  });
};
