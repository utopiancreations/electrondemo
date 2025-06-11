const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // webviewTag: true, // Enable webview tag if we decide to use it
      // partition: 'persist:myAppName' // Example for a persistent session for caching
    }
  });

  // Load index.html
  mainWindow.loadFile('src/index.html');

  // Open DevTools - useful for debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // Configure caching for the default session
  const defaultSession = session.defaultSession;

  // Option 1: Simple cache enabling (less control, relies on standard HTTP caching)
  // defaultSession.setCache({ enable: true }); // This is often enabled by default

  // Option 2: Intercept requests to implement custom caching logic (more complex, more control)
  // This is a placeholder for more advanced caching.
  // We might use a service worker in the renderer for full PWA-like offline capabilities.
  // For now, we'll rely on standard HTTP caching headers sent by the server
  // and Electron's default caching behavior.
  // A more robust solution would involve a service worker in index.html.

  defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const cacheControl = {};
    if (details.responseHeaders['cache-control'] || details.responseHeaders['Cache-Control']) {
      // If server sends cache-control, respect it but ensure it allows caching
      // For example, could override to 'public, max-age=604800' (1 week) if appropriate
    } else {
      // If no cache-control, add one
      cacheControl['Cache-Control'] = ['public, max-age=604800']; // Cache for 1 week
    }
    callback({ responseHeaders: { ...details.responseHeaders, ...cacheControl } });
  });


  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

console.log('src/main.js created and configured.');
