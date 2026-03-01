const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getAllDistricts: () => ipcRenderer.invoke('get-all-districts'),
    getDistrictById: (id) => ipcRenderer.invoke('get-district-by-id', id),
    addDistrict: (data) => ipcRenderer.invoke('add-district', data),
    updateDistrict: (id, data) => ipcRenderer.invoke('update-district', id, data),
    deleteDistrict: (id) => ipcRenderer.invoke('delete-district', id),
    deleteAllDistricts: () => ipcRenderer.invoke('delete-all-districts'),
    deleteAllArchivedDistricts: () => ipcRenderer.invoke('delete-all-archived-districts'),

    getAllMicroDistricts: (districtId) => ipcRenderer.invoke('get-all-micro-districts', districtId),
    getMicroDistrictById: (id) => ipcRenderer.invoke('get-micro-district-by-id', id),
    addMicroDistrict: (data) => ipcRenderer.invoke('add-micro-district', data),
    updateMicroDistrict: (id, data) => ipcRenderer.invoke('update-micro-district', id, data),
    deleteMicroDistrict: (id) => ipcRenderer.invoke('delete-micro-district', id),

    getAllSchools: (districtId) => ipcRenderer.invoke('get-all-schools', districtId),
    getSchoolById: (id) => ipcRenderer.invoke('get-school-by-id', id),
    addSchool: (student) => ipcRenderer.invoke('add-school', student),
    updateSchool: (id, student) => ipcRenderer.invoke('update-school', id, student),
    deleteSchool: (id) => ipcRenderer.invoke('delete-school', id),
});