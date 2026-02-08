const fs = require('fs');
const path = require('path');

const { app } = require('electron');
// const dataFilePath = path.join(app.getPath('userData'), 'db/district.json');
// const studentsFilePath = path.join(app.getPath('userData'), 'db/schools.json');

const dataFilePath = path.join(app.getPath('userData'), './db/district.json');
const studentsFilePath = path.join(app.getPath('userData'), './db/schools.json');

function initializeFile() {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
    }
}

function getAllDistricts() {
    try {
        initializeFile();
        const content = fs.readFileSync(dataFilePath, 'utf8');
        const data = JSON.parse(content);
        return { data };
    } catch (error) {
        console.error('Ошибка при чтении файла:', error);
        // Всегда возвращаем объект с полем data, чтобы вызывающий код мог безопасно деструктурировать
        return { data: [] };
    }
}

function getDistrictById(id) {
    try {
        const { data } = getAllDistricts();
        const district = data.find(item => item.id === id);
        return { data: district }
    } catch (error) {
        console.error('Ошибка при поиске данных:', error);
        return { error: `Ошибка при поиске района: ${error}` };
    }
}

function addDistrict(newItem) {
    try {
        const { data } = getAllDistricts();
        const isAlready = data.some(item => item.name === newItem.name)
        if (isAlready) return { error: "Район уже существует!" }
        data.push(newItem);
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return { data: newItem };
    } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
        return { error: `Ошибка при добавлении данных: ${error.message}` };
    }
}

function updateDistrict(id, updatedData) {
    try {
        const { data } = getAllDistricts();
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            const newData = [...data];
            newData[index] = { ...newData[index], ...updatedData, id };
            fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
            return {data: newData[index]};
        } else {
            return { error: 'Район не найден' };
        }
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        return { error: `Ошибка при обновлении данных: ${error}` };
    }
}

function deleteDistrict(id) {
    try {
        const { data: allData } = getAllDistricts();
        const filteredData = allData.filter(item => String(item.id) !== String(id));
        fs.writeFileSync(dataFilePath, JSON.stringify(filteredData, null, 2));
        if (fs.existsSync(studentsFilePath)) {
            const studentsContent = fs.readFileSync(studentsFilePath, 'utf8');
            const students = JSON.parse(studentsContent);
            const filteredStudents = students.filter(student => String(student.districtId) !== String(id));
            fs.writeFileSync(studentsFilePath, JSON.stringify(filteredStudents, null, 2));
        }
        return true;
    } catch (error) {
        console.error('Ошибка при удалении данных:', error);
        return false;
    }
}

function deleteAllDistricts() {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
        const studentsDir = path.dirname(studentsFilePath);
        if (!fs.existsSync(studentsDir)) {
            fs.mkdirSync(studentsDir, { recursive: true });
        }
        fs.writeFileSync(studentsFilePath, JSON.stringify([], null, 2));
        return { 
            success: true, 
            message: 'Все районы и школы успешно удалены' 
        };
    } catch (error) {
        console.error('Ошибка при полной очистке данных:', error);
        return { 
            success: false, 
            error: `Ошибка при очистке данных: ${error.message}`
        };
    }
}

function deleteAllArchivedDistricts() {
    try {
        const { data: allDistricts } = getAllDistricts();
        const archivedIds = allDistricts
            .filter(district => district.isInArchive === true)
            .map(district => String(district.id));
        if (archivedIds.length === 0) {
            return {
                success: true,
                message: 'Нет архивных районов для удаления'
            };
        }
        const activeDistricts = allDistricts.filter(district => !district.isInArchive);
        fs.writeFileSync(dataFilePath, JSON.stringify(activeDistricts, null, 2));
        let deletedStudentsCount = 0;
        if (fs.existsSync(studentsFilePath)) {
            const studentsContent = fs.readFileSync(studentsFilePath, 'utf8');
            const students = JSON.parse(studentsContent);
            const initialLength = students.length;
            const activeStudents = students.filter(student => 
                !archivedIds.includes(String(student.districtId))
            );
            deletedStudentsCount = initialLength - activeStudents.length;
            fs.writeFileSync(studentsFilePath, JSON.stringify(activeStudents, null, 2));
        }
        return {
            success: true,
            message: `Удалено районов: ${archivedIds.length}, школ: ${deletedStudentsCount}`,
            deletedDistricts: archivedIds.length,
            deletedSchools: deletedStudentsCount
        };
    } catch (error) {
        console.error('Ошибка при удалении архивных районов:', error);
        return {
            success: false,
            error: `Ошибка при удалении архивных районов: ${error.message}`
        };
    }
}

module.exports = {
    getAllDistricts,
    getDistrictById,
    addDistrict,
    updateDistrict,
    deleteDistrict,
    deleteAllDistricts,
    deleteAllArchivedDistricts
};

