'use strict'

var SquirrelUpdater, ChildProcess, path, appFolder, rootFolder, updateExe,
    exeName, spawn, quitAndInstall, downloadUpdate, install, installUpdate;

ChildProcess = require('child_process');
path = require('path');

appFolder = path.resolve(process.execPath, '..');
rootFolder = path.resolve(appFolder, '..');
updateExe = path.join(rootFolder, 'Update.exe');
exeName = path.basename(process.execPath);

SquirrelUpdater = function(updateFrom){
  this.updateUrl = updateFrom;
};
spawn = function(args, callback) {
  var error, spawnedProcess, stdout;
  stdout = '';
  try {
    spawnedProcess = ChildProcess.spawn(updateExe, args);
  } catch (_error) {
    error = _error;
    process.nextTick(function() {
      return typeof callback === "function" ? callback(error, stdout) : void 0;
    });
    return;
  }
  spawnedProcess.stdout.on('data', function(data) {
    return stdout += data;
  });
  error = null;
  spawnedProcess.on('error', function(processError) {
    return error != null ? error : error = processError;
  });
  return spawnedProcess.on('close', function(code, signal) {
    if (code !== 0) {
      if (error == null) {
        error = new Error("Command failed: " + (signal != null ? signal : code));
      }
    }
    if (error != null) {
      if (error.code == null) {
        error.code = code;
      }
    }
    if (error != null) {
      if (error.stdout == null) {
        error.stdout = stdout;
      }
    }
    return typeof callback === "function" ? callback(error, stdout) : void 0;
  });
};

quitAndInstall = function() {
  spawn(['--processStart', exeName], function() {});
  return require('app').quit();
};

downloadUpdate = function(updateUrl, callback) {
  return spawn(['--download', updateUrl], function(error, stdout) {
    var json, ref, ref1, update;
    if (error != null) {
      return callback(error);
    }
    try {
      json = stdout.trim().split('\n').pop();
      update = (ref = JSON.parse(json)) != null ? (ref1 = ref.releasesToApply) != null ? typeof ref1.pop === "function" ? ref1.pop() : void 0 : void 0 : void 0;
    } catch (_error) {
      error = _error;
      error.stdout = stdout;
      return callback(error);
    }
    return callback(null, update);
  });
};

installUpdate = function(updateUrl, callback) {
  return spawn(['--update',updateUrl], callback);
};

SquirrelUpdater.prototype.checkForUpdates = function() {

  if (!this.updateUrl) {
    throw new Error('Update URL is not set');
  }

  return downloadUpdate(this.updateUrl, (function(_this) {
    return function(error, update) {
      if (error != null) {
        return;
      }
      if (update == null) {
        return;
      }
      return installUpdate(_this.updateUrl, function(error) {
        if (error != null) {
          return;
        }
        return quitAndInstall();
      });
    };
  })(this));
};

module.exports = SquirrelUpdater;
