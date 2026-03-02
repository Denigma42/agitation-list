const fs = require('fs');
const path = require('path');

const { app } = require('electron');
const studentsFilePath = path.join(app.getPath('userData'), './db/schools.json');

function initializeSchoolsFile() {
    if (!fs.existsSync(studentsFilePath)) {
        fs.writeFileSync(studentsFilePath, JSON.stringify([], null, 2));
    }
}

function getAllSchools(districtId) {
    try {
        initializeSchoolsFile();
        const content = fs.readFileSync(studentsFilePath, 'utf8');
        let data = JSON.parse(content);
        if (districtId) {
            data = data.filter(school => school.districtId === districtId);
        }
        return { data };
    } catch (error) {
        console.error('Ошибка при чтении файла школ:', error);
        return { error: `Ошибка при чтении файла школ: ${error}` };
    }
}

function getSchoolById(id) {
    try {
        const { data } = getAllSchools();
        const school = data.find(item => item.id === id);
        return { data: school };
    } catch (error) {
        console.error('Ошибка при поиске школы:', error);
        return { error: `Ошибка при поиске школы: ${error}` };
    }
}

function addSchool(newSchool) {
    try {
        const { data } = getAllSchools();
        data.push(newSchool);
        fs.writeFileSync(studentsFilePath, JSON.stringify(data, null, 2));
        return { data: newSchool };
    } catch (error) {
        console.error('Ошибка при добавлении организации:', error);
        return { error: `Ошибка при добавлении организации: ${error}` };
    }
}

function updateSchool(id, updatedData) {
    try {
        const { data } = getAllSchools();
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            const newData = [...data];
            newData[index] = { ...newData[index], ...updatedData, id };
            fs.writeFileSync(studentsFilePath, JSON.stringify(newData, null, 2));
            return { data: newData[index] };
        } else {
            return { error: 'Школа не найдена' };
        }
    } catch (error) {
        console.error('Ошибка при обновлении школы:', error);
        return { error: `Ошибка при обновлении школы: ${error}` };
    }
}

function deleteSchool(id) {
    try {
        const { data } = getAllSchools();
        const filteredData = data.filter(item => item.id !== id);
        fs.writeFileSync(studentsFilePath, JSON.stringify(filteredData, null, 2));
        return true;
    } catch (error) {
        console.error('Ошибка при удалении школы:', error);
        return false;
    }
}

module.exports = {
    getAllSchools,
    getSchoolById,
    addSchool,
    updateSchool,
    deleteSchool
};

