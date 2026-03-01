const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const microDistrictsFilePath = path.join(app.getPath('userData'), './db/microDistricts.json');

function initializeFile() {
    const dir = path.dirname(microDistrictsFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(microDistrictsFilePath)) {
        fs.writeFileSync(microDistrictsFilePath, JSON.stringify([], null, 2));
    }
}

function getAllMicroDistricts(districtId) {
    try {
        initializeFile();
        const content = fs.readFileSync(microDistrictsFilePath, 'utf8');
        let data = JSON.parse(content);
        if (districtId) {
            data = data.filter(m => m.districtId === districtId);
        }
        return { data };
    } catch (error) {
        console.error('Ошибка при чтении микрорайонов:', error);
        return { data: [] };
    }
}

function getMicroDistrictById(id) {
    try {
        const { data } = getAllMicroDistricts();
        const micro = data.find(item => item.id === id);
        return { data: micro };
    } catch (error) {
        console.error('Ошибка при поиске микрорайона:', error);
        return { error: `Ошибка: ${error}` };
    }
}

function addMicroDistrict(newMicro) {
    try {
        const { data } = getAllMicroDistricts();
        // можно добавить проверку уникальности имени в пределах района, если нужно
        data.push(newMicro);
        fs.writeFileSync(microDistrictsFilePath, JSON.stringify(data, null, 2));
        return { data: newMicro };
    } catch (error) {
        console.error('Ошибка при добавлении микрорайона:', error);
        return { error: `Ошибка: ${error}` };
    }
}

function updateMicroDistrict(id, updatedData) {
    try {
        const { data } = getAllMicroDistricts();
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            const newData = [...data];
            newData[index] = { ...newData[index], ...updatedData, id };
            fs.writeFileSync(microDistrictsFilePath, JSON.stringify(newData, null, 2));
            return { data: newData[index] };
        } else {
            return { error: 'Микрорайон не найден' };
        }
    } catch (error) {
        console.error('Ошибка при обновлении микрорайона:', error);
        return { error: `Ошибка: ${error}` };
    }
}

function deleteMicroDistrict(id) {
    try {
        const { data } = getAllMicroDistricts();
        const filtered = data.filter(item => item.id !== id);
        fs.writeFileSync(microDistrictsFilePath, JSON.stringify(filtered, null, 2));

        // Каскадное удаление школ этого микрорайона
        const schoolsFilePath = path.join(app.getPath('userData'), './db/schools.json');
        if (fs.existsSync(schoolsFilePath)) {
            const schoolsContent = fs.readFileSync(schoolsFilePath, 'utf8');
            const schools = JSON.parse(schoolsContent);
            const filteredSchools = schools.filter(s => s.microDistrictId !== id);
            fs.writeFileSync(schoolsFilePath, JSON.stringify(filteredSchools, null, 2));
        }
        return true;
    } catch (error) {
        console.error('Ошибка при удалении микрорайона:', error);
        return false;
    }
}

module.exports = {
    getAllMicroDistricts,
    getMicroDistrictById,
    addMicroDistrict,
    updateMicroDistrict,
    deleteMicroDistrict
};