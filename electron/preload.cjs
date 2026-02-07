const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getAllDistricts: () => ipcRenderer.invoke('get-all-districts'),
    getDistrictById: (id) => ipcRenderer.invoke('get-district-by-id', id),
    addDistrict: (data) => ipcRenderer.invoke('add-district', data),
    updateDistrict: (id, data) => ipcRenderer.invoke('update-district', id, data),
    deleteDistrict: (id) => ipcRenderer.invoke('delete-district', id),
    deleteAllDistricts: () => ipcRenderer.invoke('delete-all-districts'),
    deleteAllArchivedDistricts: () => ipcRenderer.invoke('delete-all-archived-districts'),

    getAllSchools: (districtId) => ipcRenderer.invoke('get-all-schools', districtId),
    getSchoolById: (id) => ipcRenderer.invoke('get-school-by-id', id),
    addSchool: (student) => ipcRenderer.invoke('add-school', student),
    updateSchool: (id, student) => ipcRenderer.invoke('update-school', id, student),
    deleteSchool: (id) => ipcRenderer.invoke('delete-school', id),
});