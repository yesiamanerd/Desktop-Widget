const { app, BrowserWindow, screen } = require('electron');



function createWindow() {

  // Get screen dimensions
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  // Calculate x-coordinate for right alignment
  const xPosition = screenWidth - 800; // 800 is the width of your current display content

  // Create the browser window with new configuration
  const win = new BrowserWindow({

    width: 3440,      // Total width to accommodate all divs
    height: 1440,     // Set the height to 1440
    x: 0,             // Position at the left edge of the screen
    y: 0,             // Position at the top
    frame: false,     // Remove the window frame
    resizable: false, // Make window not resizable
    alwaysOnTop: false,
    focusable: true,  // allows the Electron icon on the taskbar
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.setVisibleOnAllWorkspaces(true);
  win.setFullScreenable(false);

  // Load your HTML file or URL
  win.loadFile('index.html');  // Make sure to point to your HTML file

  // Open the DevTools.
  // win.webContents.openDevTools();

}

app.whenReady().then(createWindow);

// This is a good practice to handle window creation after the app is activated
// e.g., after quitting and then clicking the app's icon in the dock.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


