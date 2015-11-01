# QuirkbotCODE

QuirkbotCODE is a cross platform application, built on [Electron](https://github.com/atom/electron)

### Setup

Clone this repository, including submodules
```
git clone https://github.com/Quirkbot/QuirkbotCODE-Electron --recursive
```

Install npm dependencies

```
npm install
```
Rebuild electron (due to the native npm modules).

```
node ./node_modules/.bin/electron-rebuild
```

Patch `serialport` build folder
```
mv node_modules/serialport/build/serialport/v2.0.2/Release/electron-v0.34-darwin-x64 node_modules/serialport/build/serialport/v2.0.2/Release/node-v46-darwin-x64
```

Everything in one go:
```
git clone https://github.com/Quirkbot/QuirkbotCODE-Electron --recursive
npm install
node ./node_modules/.bin/electron-rebuild
mv node_modules/serialport/build/serialport/v2.0.2/Release/electron-v0.34-darwin-x64 node_modules/serialport/build/serialport/v2.0.2/Release/node-v46-darwin-x64
```
### Build

Builds can be generated easily via
```
./node_modules/.bin/grunt build
```
Builds are generated using the  [electron-packager](https://github.com/maxogden/electron-packager) combined with
configuration from the ``config.json`` file. See the [Configuration documentation](config.md) for more details.

### Development & Debugging

To run up the application

```
./node_modules/.bin/electron .
```

To debug, there are two options

- Debugging render processes with the [chrome dev tools](http://electron.atom.io/docs/v0.31.0/tutorial/devtools-extension/)
- Attach a ``node-inspector`` remote debugger. To [debug the main process](http://electron.atom.io/docs/v0.31.0/tutorial/using-native-node-modules/) via the following helper scripts:
```
./node_modules/.bin/grunt debug
```
Node inspector can be quite slow to load. If you are looking to step through code at the beginning of the applications life cycle, it can  be helpful to add a blocking wait on application start up.

Note: currently this is only supported in [Electron v 0.27.1](https://github.com/atom/electron/releases?after=v0.27.1)

### Packaging

Application installation, and automatic updates are driven by [Squirrel](https://github.com/Squirrel).

#### Windows

To create a [Windows Squirrel installer](https://github.com/Squirrel/Squirrel.Windows/) run:

```
  script\package
```

This command should be run on a Windows machine.

#### OSX

TBC

### Release

That :ship: life!

#### Windows

To release the Squirrel installer:

```
  script\release
```

This uploads an installer to S3. You can provide access keys by adding a ``s3.key`` file to the root in the following format
```
AWSAccessKeyId=MYACCESSKEY
AWSSecretKey=SECRETKEY
```
``s3.key`` is ignored in the ``.gitignore`` file. Please do not check in sensitive information such as s3 keys.

#### OSX
TBC
