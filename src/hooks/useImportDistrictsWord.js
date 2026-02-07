import { useState } from "react";
import mammoth from "mammoth";
import JSZip from "jszip";
import useAddDistrict from "./useAddDistrict";
import useAddSchool from "./useAddSchool";
import useGetSchools from "./useGetSchools";
import useGetDistricts from "./useGetDistricts";

function extractDistrictInfo(title = "") {
    const numberMatch = title.match(/район.*?(\d+[а-яa-z]*)/i);
    let number = numberMatch ? numberMatch[1] : "";
    
    let type = '';
    if (/кадров/i.test(title)) type = 'Кадровые офицеры';
    else if (/офицер/i.test(title)) type = 'Офицеры запаса';
    else if (/солдат/i.test(title)) type = 'Солдаты запаса';
    return { number, type };
}

async function getColoredRowsInfo(fileBuffer) {
    try {
        const zip = await JSZip.loadAsync(fileBuffer);
        const documentXml = await zip.file('word/document.xml').async('text');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
        const coloredRows = [];
        const tables = xmlDoc.getElementsByTagName('w:tbl');
        for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            const table = tables[tableIndex];
            const rows = table.getElementsByTagName('w:tr');
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                const cells = row.getElementsByTagName('w:tc');
                let isColored = false;
                for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                    const cell = cells[cellIndex];
                    const tcPr = cell.getElementsByTagName('w:tcPr')[0];
                    if (tcPr) {
                        const shd = tcPr.getElementsByTagName('w:shd')[0];
                        if (shd && shd.getAttribute('w:fill')) {
                            const fillColor = shd.getAttribute('w:fill');
                            if (fillColor && fillColor !== 'auto' && fillColor !== 'FFFFFF' && fillColor !== '000000') {
                                isColored = true;
                                break;
                            }
                        }
                    }
                    const paragraphs = cell.getElementsByTagName('w:p');
                    for (let p = 0; p < paragraphs.length; p++) {
                        const runs = paragraphs[p].getElementsByTagName('w:r');
                        for (let r = 0; r < runs.length; r++) {
                            const run = runs[r];
                            const rPr = run.getElementsByTagName('w:rPr')[0];
                            if (rPr) {
                                const color = rPr.getElementsByTagName('w:color')[0];
                                if (color && color.getAttribute('w:val')) {
                                    const colorVal = color.getAttribute('w:val');
                                    if (colorVal && colorVal !== 'auto' && colorVal !== '000000' && colorVal !== 'FFFFFF') {
                                        isColored = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (isColored) break;
                    }
                    if (isColored) break;
                }
                if (isColored) {
                    coloredRows.push({
                        tableIndex,
                        rowIndex
                    });
                }
            }
        }
        return coloredRows;
    } catch (error) {
        console.error('Ошибка при анализе цветов:', error);
        return [];
    }
}

export default function useImportDistrictsWord() {
    const [importStatus, setImportStatus] = useState("");
    const [districts, setDistricts] = useState([]);
    const [schools, setSchools] = useState([]);
    
    const { createDistrict } = useAddDistrict();
    const { addSchool } = useAddSchool();
    const { getSchools } = useGetSchools({ setSchools });
    const { getDistricts } = useGetDistricts({ setDistricts });

    const importFromWord = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        await getDistricts();
        await getSchools();
        
        setImportStatus("Импортирую...");
        try {
            const arrayBuffer = await file.arrayBuffer();
            const coloredRowsInfo = await getColoredRowsInfo(arrayBuffer);
            console.log('Цветные строки:', coloredRowsInfo);
            const { value } = await mammoth.convertToHtml({ arrayBuffer });
            const doc = document.createElement("div");
            doc.innerHTML = value;

            const nodes = Array.from(doc.childNodes);
            let districtBlocks = [];
            let currentTitle = null;
            let debugLog = [];
            let currentDistrictType = 'Кадровые офицеры';
            let officerBuffer = [];
            
            nodes.forEach(node => {
                if (node.nodeType === 1) {
                    const text = node.textContent.trim();
                    if (currentTitle && node.tagName !== 'TABLE' && text) {
                        officerBuffer.push(text);
                    }
                    if (text) {
                        if (/кадров|офицер.*кадр/i.test(text)) {
                            currentDistrictType = 'Кадровые офицеры';
                            debugLog.push(`Определен тип: ${currentDistrictType}`);
                        } else if (/офицер.*запас|ОФИЦЕРЫ ЗАПАСА/i.test(text)) {
                            currentDistrictType = 'Офицеры запаса';
                            debugLog.push(`Определен тип: ${currentDistrictType}`);
                        } else if (/солдат.*запас|СОЛДАТЫ ЗАПАСА/i.test(text)) {
                            currentDistrictType = 'Солдаты запаса';
                            debugLog.push(`Определен тип: ${currentDistrictType}`);
                        }
                        
                        if (/учебн.*район.*\d+[а-яa-z]*/i.test(text) || /район.*\d+[а-яa-z]*/i.test(text)) {
                            currentTitle = text;
                            debugLog.push(`Найден район: ${text}, тип: ${currentDistrictType}`);
                        }
                    }
                }
                
                if (node.tagName === 'TABLE' && currentTitle) {
                    const { number } = extractDistrictInfo(currentTitle);
                    let finalType = currentDistrictType;
                    const fullOfficerText = officerBuffer.join('\n').trim();
                    const officerBlock = fullOfficerText.match(/ответственный офицер[\s\S]*/i)
                        ? fullOfficerText.match(/ответственный офицер[\s\S]*/i)[0].trim() : '';
                    officerBuffer = [];
                    if (number && /[а-яa-z]$/i.test(number) && currentDistrictType !== 'Солдаты запаса') {
                        finalType = 'Солдаты запаса';
                        debugLog.push(`Принудительно установлен тип "Солдаты запаса" для района ${number}`);
                    }
                    
                    districtBlocks.push({ 
                        title: currentTitle, 
                        table: node,
                        type: finalType,
                        officer: officerBlock
                    });
                    debugLog.push(`Добавлена таблица для района: ${currentTitle}, тип: ${finalType}, офицер: ${officerBlock}`);
                    currentTitle = null;
                }
            });

            let totalDistricts = 0, totalSchools = 0;
            let skippedDistricts = 0, skippedSchools = 0;
            let tableIndex = 0;
            
            for (const block of districtBlocks) {
                const { number } = extractDistrictInfo(block.title);
                
                if (!number) {
                    debugLog.push(`Не удалось извлечь номер из: ${block.title}`);
                    tableIndex++;
                    continue;
                }
                
                debugLog.push(`Обрабатываем район №${number}, тип: ${block.type}`);
                
                const existingDistrict = districts.find(
                    p => p.number === number && p.type === block.type
                );
                
                let usedDistrictId;
                
                if (existingDistrict) {
                    usedDistrictId = existingDistrict.id;
                    debugLog.push(`Район ${number} уже существует, используем ID: ${usedDistrictId}`);
                    skippedDistricts++;
                } else {
                    const districtId = Date.now().toString() + Math.floor(Math.random()*1000);
                    const newDistrict = { 
                        id: districtId, 
                        number, 
                        type: block.type,
                        officer: block.officer || '',
                        isInArchive: false,
                    };
                    
                    const districtRes = await createDistrict(newDistrict);
                    if (!districtRes?.data) {
                        debugLog.push(`Ошибка создания района ${number}`);
                        tableIndex++;
                        continue;
                    }
                    
                    totalDistricts++;
                    usedDistrictId = districtRes.data.id || districtId;
                    setDistricts(prev => [...prev, { ...newDistrict, id: usedDistrictId }]);
                }
                
                const rows = Array.from(block.table.rows);
                debugLog.push(`Найдено строк в таблице: ${rows.length}`);
                
                if (rows.length < 2) {
                    debugLog.push(`Таблица района ${number} слишком мала`);
                    tableIndex++;
                    continue;
                }
                
                const headerCells = Array.from(rows[0].cells);
                const headers = headerCells.map(cell => cell.textContent.trim().toLowerCase());
                debugLog.push(`Заголовки таблицы: ${headers.join(', ')}`);
                
                const fioIndex = headers.findIndex(h => /фио|ф\.и\.о/i.test(h));
                const groupIndex = headers.findIndex(h => /учебн.*групп|групп/i.test(h));
                const commanderIndex = headers.findIndex(h => /младш.*командир/i.test(h));
                
                if (fioIndex === -1) {
                    debugLog.push(`Не найдена колонка ФИО в таблице района ${number}`);
                    tableIndex++;
                    continue;
                }
                
                debugLog.push(`Индексы колонок - ФИО: ${fioIndex}, Группа: ${groupIndex}`);
                
                for (let i = 1; i < rows.length; i++) {
                    const cells = Array.from(rows[i].cells);
                    
                    if (cells.length <= fioIndex) {
                        continue;
                    }
                    
                    const fioCell = cells[fioIndex];
                    const fioText = fioCell.textContent.trim();
                    
                    if (!fioText || 
                        fioText.includes('Институт') || 
                        fioText.includes('Факультет') ||
                        fioText.includes('№ п/п') ||
                        fioText.length < 2) {
                        continue;
                    }
                    
                    const isColoredRow = coloredRowsInfo.some(info => 
                        info.tableIndex === tableIndex && info.rowIndex === i
                    );
                    
                    const schoolData = {
                        fio: fioText,
                        fieldOfStudy: groupIndex !== -1 && cells[groupIndex] ? 
                            cells[groupIndex].textContent.trim() : '',
                        status: isColoredRow ? 'Отстранён' : 'Зачислен',
                        juniorCommander: commanderIndex !== -1 && cells[commanderIndex] ?
                            cells[commanderIndex].textContent.trim() : '',
                    };
                    
                    const existingSchool = schools.find(
                        s => s.fio === schoolData.fio && s.districtId === usedDistrictId
                    );
                    
                    if (existingSchool) {
                        debugLog.push(`Школа ${schoolData.fio} уже существует в районе ${number}, пропускаем`);
                        skippedSchools++;
                        continue;
                    }
                    
                    debugLog.push(`Школа: ${schoolData.fio}, статус: ${schoolData.status}, цветная строка: ${isColoredRow}`);
                    
                    const newSchool = {
                        id: Date.now().toString() + Math.floor(Math.random()*1000),
                        districtId: usedDistrictId,
                        fio: schoolData.fio,
                        fieldOfStudy: schoolData.fieldOfStudy,
                        status: schoolData.status,
                        juniorCommander: schoolData.juniorCommander,
                        isInArchive: false,
                    };
                    
                    const schoolRes = await addSchool(newSchool);
                    if (schoolRes?.data) {
                        totalSchools++;
                        debugLog.push(`Успешно добавлена школа: ${schoolData.fio}`);
                        setSchools(prev => [...prev, { ...newSchool, id: schoolRes.data.id || newSchool.id }]);
                    } else {
                        debugLog.push(`Ошибка добавления школы: ${schoolData.fio}`);
                    }
                }
                
                tableIndex++;
                debugLog.push(`Район ${number}: обработано школ - ${totalSchools}, пропущено - ${skippedSchools}`);
            }
            
            const resultMessage = `Импорт завершен. 
                Создано районов: ${totalDistricts}, пропущено: ${skippedDistricts}
                Создано школ: ${totalSchools}, пропущено: ${skippedSchools}`;
            setImportStatus(resultMessage);
            console.log('Результат импорта:', resultMessage);
            console.log('Детали:', debugLog);
            window.location.reload();
        } catch (err) {
            console.error('Ошибка импорта:', err);
            setImportStatus('Ошибка импорта: ' + err.message);
        } finally {
            event.target.value = "";
            setTimeout(() => setImportStatus(""), 15000);
        }
    };

    return { importFromWord, importStatus };
}

