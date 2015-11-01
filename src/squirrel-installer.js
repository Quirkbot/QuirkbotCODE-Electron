'use strict'

var SquirrelInstaller, ChildProcess, path, appFolder,
    rootFolder, updateExe, exeName, spawn, spawnUpdate,
    createShortcuts, removeShortcuts, install, update,
    uninstall;

ChildProcess = require('child_process');
path = require('path');

appFolder = path.resolve(process.execPath, '..');
rootFolder = path.resolve(appFolder, '..');
updateExe = path.join(rootFolder, 'Update.exe');
exeName = path.basename(process.execPath);

SquirrelInstaller = function(){};

spawn = function(command, args, callback) {
  var error, spawnedProcess, stdout;
  stdout = '';
  try {
    spawnedProcess = ChildProcess.spawn(command, args);
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

spawnUpdate = function(args, callback) {
  return spawn(updateExe, args, callback);
};

createShortcuts = function(callback) {
  return spawnUpdate(['--createShortcut', exeName], callback);
};

removeShortcuts = function(callback) {
  return spawnUpdate(['--removeShortcut', exeName], callback);
};

install = function (done) {
  createShortcuts(done);
};

update = function (done) {
  done();
};

uninstall = function (done) {
  removeShortcuts(done);
};

SquirrelInstaller.prototype.handleStartupEvent = function(app, squirrelCommand) {
  switch (squirrelCommand) {
    case '--squirrel-install':
      install(app.quit);
      return true;
    case '--squirrel-updated':
      update(app.quit);
      return true;
    case '--squirrel-uninstall':
      uninstall(app.quit);
      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of --squirrel-updated
      app.quit();
      return true;
    default:
      return false;
  }
};
module.exports = new SquirrelInstaller();
