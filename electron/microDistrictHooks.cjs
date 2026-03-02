const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const microDistrictsFilePath = path.join(app.getPath('userData'), './db/schools.json');

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

function updateMicroDistrict(oldTitle, updatedData) {
    try {
        const newTitle =
            (updatedData && (updatedData.title || updatedData.newTitle)) ||
            (typeof updatedData === 'string' ? updatedData : null);

        if (!newTitle) {
            return { error: 'Новое название микрорайона не указано' };
        }

        const { data } = getAllMicroDistricts();

        let updatedCount = 0;
        const newData = data.map((school) => {
            if (school.microDistrictTitle === oldTitle) {
                updatedCount += 1;
                return { ...school, microDistrictTitle: newTitle };
            }
            return school;
        });

        fs.writeFileSync(microDistrictsFilePath, JSON.stringify(newData, null, 2));

        return {
            data: {
                updatedCount,
                oldTitle,
                newTitle,
            },
        };
    } catch (error) {
        console.error('Ошибка при обновлении микрорайона:', error);
        return { error: `Ошибка: ${error}` };
    }
}


module.exports = {
    getAllMicroDistricts,
    updateMicroDistrict,
};