/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs  from 'fs'
import os from 'os'
import IpcFunctions from './ipcFunctions'
import { isText, isBinary } from 'istextorbinary'

//-------------------------------------------------------------------------------------------------------------
let functions: IpcFunctions | null = null;
//export pdf
ipcMain.on('exportPDF', function(event, args) {
  functions?.exportPDF(args)
})

//open file
ipcMain.handle('saveFile', async function() {
  return functions?.saveFile()
})


//load file
ipcMain.handle('openFolder', async function() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {properties: ['openDirectory']});
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
})

//load file, first return value is file content, second value specifies binary error
ipcMain.handle('loadFile', function(event, args) {
	console.log(args)
  let data;
  try {
    data = fs.readFileSync(args);
    //check if binary file
    if(isBinary(args, data)) {
      return ["", true];
    }
  } catch(err){
    return null;
  }
  return [data.toString('utf8'), false];
})

//open file
ipcMain.handle('openFile', async function() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {properties: ['openFile']});
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
})

// read file paths of specified directory
ipcMain.handle('readFilePaths', function(event, args) {
  return getFilesOfDirectory(args);
})

function getFilesOfDirectory(dirPath : string) : string[] {
  let files = fs.readdirSync(dirPath);
  let codeFiles:string[] = [];
  files.forEach(function (file) {
    let filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesOfDirectory(filePath).forEach(path => codeFiles.push(path));
    }
    //check if filename is text file and not a hidden file or ignored file
    else {
      if(isText(filePath) && !isUnixHiddenPath(filePath) && !ignoreFilesWithFileEndings(filePath)) {
        codeFiles.push(filePath);
      }
    }
  });
  return codeFiles;
}

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * @returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 * @author https://stackoverflow.com/questions/8905680/nodejs-check-for-hidden-files/20285137#20285137
 */
 var isUnixHiddenPath = function (path : string) {
  return (/(^|\/)\.[^\/\.]/g).test(path);
};

//ignore files with certain file endings
function ignoreFilesWithFileEndings(path : string) {
  let fileEndings = [".ini"]
  for (let i = 0, len = fileEndings.length; i < len; i++) {
    if(path.endsWith(fileEndings[i])) {
      return true;
    }
  }
  return false;
}




//-------------------------------------------------------------------------------------------------------------

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  //add ipc functions
  functions = new IpcFunctions(mainWindow);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
