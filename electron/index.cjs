const { app, BrowserWindow, screen, ipcMain } = require('electron/main');
const path = require('path');
const dbPath = path.join(app.getPath('userData'), 'db');

const {
  getAllDistricts,
  getDistrictById,
  addDistrict,
  updateDistrict,
  deleteDistrict,
  deleteAllDistricts,
  deleteAllArchivedDistricts } = require('./districtHooks.cjs');

const {
  getAllSchools,
  getSchoolById,
  addSchool,
  updateSchool,
  deleteSchool } = require('./schoolHooks.cjs');

const fs = require('fs');
const fsp = fs.promises;
const dbFolderName = 'db';

async function ensureDbInUserData() {
  const userDbPath = path.join(app.getPath('userData'), dbFolderName);
  if (!fs.existsSync(userDbPath)) {
    // Копируем db из resources или рядом с exe (корень)
    let sourceDbPath;
    if (fs.existsSync(path.join(process.resourcesPath, dbFolderName))) {
      sourceDbPath = path.join(process.resourcesPath, dbFolderName);
    } else {
      sourceDbPath = path.join(__dirname, '..', dbFolderName);
    }
    // Копируем всё содержимое
    await fsp.mkdir(userDbPath, { recursive: true });
    for (const file of fs.readdirSync(sourceDbPath)) {
      await fsp.copyFile(
        path.join(sourceDbPath, file),
        path.join(userDbPath, file)
      );
    }
  }
}

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    title: 'Агитационный лист',
    icon: path.join(__dirname, '../dist/BVL.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  //win.webContents.openDevTools()
  win.maximize();

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// IPC обработчики

// Район
ipcMain.handle('get-all-districts', async () => {
  return getAllDistricts();
});

ipcMain.handle('get-district-by-id', async (event, id) => {
  return getDistrictById(id);
});

ipcMain.handle('add-district', async (event, data) => {
  return addDistrict(data);
});

ipcMain.handle('update-district', async (event, id, data) => {
  return updateDistrict(id, data);
});

ipcMain.handle('delete-district', async (event, id) => {
  return deleteDistrict(id);
});

ipcMain.handle('delete-all-districts', async (event, id) => {
  return deleteAllDistricts();
});

ipcMain.handle('delete-all-archived-districts', async (event, id) => {
  return deleteAllArchivedDistricts();
});


// Школа
ipcMain.handle('get-all-schools', async (event, districtId) => {
  return getAllSchools(districtId);
});

ipcMain.handle('get-school-by-id', async (event, id) => {
  return getSchoolById(id);
});

ipcMain.handle('add-school', async (event, student) => {
  return addSchool(student);
});

ipcMain.handle('update-school', async (event, id, student) => {
  return updateSchool(id, student);
});

ipcMain.handle('delete-school', async (event, id) => {
  return deleteSchool(id);
});

app.whenReady().then(async () => {
  await ensureDbInUserData();
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})