const url = require('url');
const path = require('path');
const electron = require('electron');

const port = 8090;
let win;

// TODO: install devtron

function createWindow() {
  win = new electron.BrowserWindow({ height: 800, width: 700 });

  win.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file',
    slashes: true
  }));

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

