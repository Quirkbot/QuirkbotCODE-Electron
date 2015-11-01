module.exports = function(grunt) {
  'use strict'

  var s3 = require('s3');
  var fs = require('fs');
  var ProgressBar = require('progressbar').ProgressBar;

  grunt.registerTask('release-windows-distributable', 'Releases the distributable for Windows', function() {
    var buildOptions, done;

    buildOptions = grunt.option('buildOptions');
    done = this.async();

    if(process.platform !== 'win32'){
      grunt.log.warn('Skipping releasing the win32 distributable because the current platform is not win32');
      return;
    }

    if(buildOptions.platform == 'all' || buildOptions.platform == 'win32'){

      grunt.log.writeln('Reading s3 keys from ./s3.key');

      var upload = function(key, secret){
          var params = {
            localDir: "releases/win32/hello-world-setup",
            s3Params: {
              Bucket: buildOptions.s3BucketName,
              Prefix: buildOptions.s3PrefixName
            },
          };

          var client = s3.createClient({ s3Options: { accessKeyId: key, secretAccessKey: secret } });

          var uploader = client.uploadDir(params);
          var progress = new ProgressBar();

          progress.step('Uploading to S3');

          uploader.on('error', function(err) {
            grunt.log.error("Unable to upload windows distributable to s3 ", err.stack);
            done(false);
          });

          uploader.on('progress', function() {
            progress.setTotal(uploader.progressTotal)
            progress.setTick(uploader.progressAmount);
          });

        uploader.on('end', function() {
          grunt.log.ok("Done uploading windows distributable to s3");
          done();
        });
      };

      fs.readFile('./s3.key', function(err, data) {
        var accessKey, secret;

        if (err) {
          grunt.log.error('Could not read s3.key: '+ err );
        }

        try {

          var bufferString = data.toString();
          var bufferStringSplit = bufferString.split('\n');

          accessKey = bufferStringSplit[0].split('AWSAccessKeyId=')[1];
          secret = bufferStringSplit[1].split('AWSSecretKey=')[1];

        }catch(error) {
          grunt.log.error('s3.key was not in the expected format: '+ error );
        }

        upload(accessKey, secret);
      });
    }
  });

  grunt.registerTask('release-linux-distributable', 'Releases the distributable for Linux', function() {
    var buildOptions = grunt.option('buildOptions');

    if(process.platform !== 'linux'){
      grunt.log.warn('Skipping releasing the linux distributable because the current platform is not linux');
      return;
    }

    if(buildOptions.platform == 'all' || buildOptions.platform == 'linux'){
      grunt.log.writeln('Releasing '+ buildOptions.name +' Linux distributable not implemented');
    }
  });

  grunt.registerTask('release-darwin-distributable', 'Releases the distributable for Darwin', function() {
    var buildOptions = grunt.option('buildOptions');

    if(process.platform !== 'darwn'){
      grunt.log.warn('Skipping releasing the darwin distributable because the current platform is not darwin');
      return;
    }

    if(buildOptions.platform == 'all' || buildOptions.platform == 'darwin'){
      grunt.log.writeln('Releasing '+ buildOptions.name +' darwn distributable not implemented');
    }
  });
};
