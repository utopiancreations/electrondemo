const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded.');
  // Example: Expose a safe API to the renderer process
  // contextBridge.exposeInMainWorld('electronAPI', {
  //   sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  //   receiveMessage: (channel, func) => {
  //     ipcRenderer.on(channel, (event, ...args) => func(...args));
  //   }
  // });
});
