const { app, BrowserWindow, screen, ipcMain, session } = require('electron');
const spotifyAuth = require('./spotifyAuth.js');

let mainWindow;
let authWindow;

function createWindow() {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
  const xPosition = screenWidth - 800; // Adjust if necessary

  mainWindow = new BrowserWindow({
    width: 3440,      // Adjust if necessary
    height: 1440,     // Adjust if necessary
    x: 0,
    y: 0,
    frame: false,
    resizable: false,
    alwaysOnTop: false,
    focusable: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
}



// ipcMain.on('handle-redirect', (event, url) => {
//   const raw_code = /code=([^&]*)/.exec(url) || null;
//   const code = raw_code ? raw_code[1] : null;
//   if (code) {
//     spotifyAuth.exchangeCodeForToken(code);
//     if (authWindow) authWindow.close();
//   }
// });




app.on('ready', () => {
  createWindow();
  createAuthWindow(); // Add this line to open the auth window on app start

  session.defaultSession.webRequest.onBeforeRequest(
      { urls: ['http://localhost:8888/callback*'] },
      (details, callback) => {
        const url = details.url;
        const urlObj = new URL(url);
        const authCode = urlObj.searchParams.get('code');
        console.log(`Intercepted authorization code: ${authCode}`);
        // Exchange the authorization code for tokens
        spotifyAuth.exchangeCodeForToken(authCode);
        // Close the auth window
        if (authWindow) authWindow.close();
        callback({ cancel: true }); // Prevent the actual navigation
      }
  );
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


/***********************************************************/
/***********************************************************/
/**                SPOTIFY AUTHENTICATION                 **/
/***********************************************************/
/***********************************************************/
// Spotify Authentication

function createAuthWindow() {
  authWindow = new BrowserWindow({
    width: 500,
    height: 600,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const scope = 'streaming user-read-private user-read-email user-library-read';

  // Replace 'YOUR_CLIENT_ID' with your actual client ID and 'YOUR_SCOPES' with your desired scopes
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=714028e7932d47b39c83737a841a6735&response_type=code&redirect_uri=http://localhost:8888/callback&scope=${encodeURIComponent(scope)}&show_dialog=true`;
  authWindow.loadURL(spotifyAuthUrl);
  authWindow.focus();








  // authWindow.webContents.on('will-redirect', (event, url) => {
  //   console.log(`Redirecting to URL: ${url}`); // Log the redirect URL
  //   // Check if the URL is your redirect URI
  //   if (url.startsWith('http://localhost:8888/callback')) {
  //     event.preventDefault(); // Prevent Electron from actually navigating to the callback URL
  //     // Parse the authorization code from the URL
  //     const urlObj = new URL(url);
  //     const authCode = urlObj.searchParams.get('code');
  //     console.log(`Authorization code extracted: ${authCode}`); // Log the auth code
  //     // Here you would exchange the authCode for tokens
  //     // For example: spotifyAuth.exchangeCodeForToken(authCode);
  //     spotifyAuth.exchangeCodeForToken(authCode);
  //     // Then close the auth window
  //     console.log(`Trying to close auth window...`);
  //     authWindow.close();
  //     // if (authWindow) {
  //     //   authWindow.close();
  //     //   console.log(`Auth window should be closed now.`);
  //     // }
  //   }
  // });

  // authWindow.webContents.on('did-navigate', (event, url) => {
  //   console.log(`did-navigate event fired with URL: ${url}`);
  //   // Similar handling as above...
  // });

  authWindow.on('closed', () => {
    console.log(`Auth window closed`);
    authWindow = null;
  });
}


// Call this function somewhere in your code to start the authentication process
// createAuthWindow();


