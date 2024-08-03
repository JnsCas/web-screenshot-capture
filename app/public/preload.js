const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  captureScreenshot: (url, format) => ipcRenderer.invoke('capture-screenshot', url, format),
});
