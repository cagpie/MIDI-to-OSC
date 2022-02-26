process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

const { app, BrowserWindow, ipcMain} = require('electron');
const osc = require('node-osc');

const oscClient = new osc.Client('127.0.0.1', 9000);

// let sendCount = 0;
// const oscServer = new osc.Server(9001);
// oscServer.on('message', (msg, rinfo) => {
//   console.log(msg);
//   for(let i = 0; i < msg.length; i++) {
//     console.log(msg[i]);
//   }
//   const sendMsg = new osc.Message('/address');
//   sendMsg.append('test');
//   sendMsg.append(sendCount);
//   oscClient.send(sendMsg);
//   sendCount++;
// });

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 800, height: 600,
  });

  mainWindow.loadFile('index.html');

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('oscMessage', (event, arg) => {
    const data = JSON.parse(arg.message)
    console.log(data)
    oscClient.send(data.osc, data.value)
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})