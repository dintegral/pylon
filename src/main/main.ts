import { app, BrowserWindow, screen, protocol, nativeTheme } from 'electron';
import * as path from 'path';
import fetch from 'node-fetch';
import { icpProtocolScheme, registerIcpProtocol } from './icp-protocol';

global.fetch = fetch as any;

const args = process.argv.slice(1);
const serve = args.some((val) => val === '--serve');

function createWindow(): void {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // [TODO] - Remove hard coded theme in production
  nativeTheme.themeSource = 'dark';
  const themingOptions: Electron.BrowserWindowConstructorOptions =
    nativeTheme.shouldUseDarkColors
      ? {
          backgroundColor: '#212529',
          titleBarOverlay: {
            color: '#212529',
            symbolColor: '#adb5bd',
          },
        }
      : {
          titleBarOverlay: {
            color: '#fff',
          },
        };

  let browserWindow = new BrowserWindow({
    ...themingOptions,
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    title: 'Pylon',
    titleBarStyle: 'hidden',
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  browserWindow.setMenuBarVisibility(false);
  nativeTheme.themeSource = 'dark';

  if (serve) {
    browserWindow.loadURL('http://localhost:4200');
  } else {
    const url = new URL(
      path.join('file:', __dirname, '..', 'renderer', 'index.html'),
    );

    browserWindow.loadURL(url.href);
  }

  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });

  browserWindow.webContents.addListener(
    'did-attach-webview',
    (_event, webcontents) => {
      webcontents.setWindowOpenHandler((details) => ({
        action: 'allow',
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
        },
      }));
    },
  );
}

try {
  protocol.registerSchemesAsPrivileged([
    icpProtocolScheme,
    {
      scheme: 'https',
      privileges: {
        secure: true,
        standard: true,
      },
    },
  ]);

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    registerIcpProtocol();

    // Added 400 ms to fix the black background issue while using transparent window.
    // More detais at https://github.com/electron/electron/issues/15947
    setTimeout(createWindow, 400);

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}