const url = require('url');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu, dialog, ipcMain }  = electron;
require('electron-debug')();

const port = 8090;
let win;

// TODO: install devtron

function createWindow() {
  win = new BrowserWindow({ height: 800, width: 700 });

  win.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file',
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const template = [{
  label: 'File',
  submenu: [{
    label: 'Open Folder',
    accelerator: 'Ctrl+O',
    click: () => {
      dialog.showOpenDialog({ properties: ['openDirectory'] }, dirName => {
        if (!dirName) {
          return;
        }

        console.log(dirName);
        win.webContents.send('open-repo', dirName.pop());
      });
    }
  }]
}];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

