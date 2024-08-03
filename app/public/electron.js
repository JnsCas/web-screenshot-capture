const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron/main');
const { join } = require('path');
const { handleScreenshot } = require('./screenshot');
const { closeBrowser } = require('./puppeteerUtils');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.on('closed', async () => {
    mainWindow = null; // so it can be garbage collected
    await closeBrowser();
  });
};

app.whenReady().then(() => {
  ipcMain.handle('capture-screenshot', handleScreenshot);
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
