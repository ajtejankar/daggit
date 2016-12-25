const url = require('url');
const path = require('path');
const electron = require('electron');

const port = 8090;
let win;


function createWindow() {
  win = new electron.BrowserWindow({ width: 800, height: 600 });

  win.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file',
    slashes: true
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

electron.app.on('ready', createWindow);

electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

