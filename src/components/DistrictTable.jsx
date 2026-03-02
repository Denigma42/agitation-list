import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button, Checkbox, CloseButton, Dialog, Group, Input, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useGetDistrictById from "../hooks/useGetDistrictById";
import useGetSchools from "../hooks/useGetSchools";
import SchoolModal from "./SchoolModal";
import useDownloadTableWord from "../hooks/useDownloadTableWord";
import useImportDistrictsWord from "../hooks/useImportDistrictsWord";
import MicroTable from "./MicroDistrictTable";
import MicroDistrictTableModal from "./MicroDistrictTableModal";
import { withoutMicroDistrictTitle } from "../consts";
import useUpdateMicroDistrict from "../hooks/useUpdateMicroDistrict";

export default function DistrictTable() {
    const { id: districtId } = useParams();

    const [school, setSchool] = useState([]);
    const [editSchool, setEditSchool] = useState({});
    const [search, setSearch] = useState('');
    const [showOnlyCadetClasses, setShowOnlyCadetClasses] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [openedDialog, { toggle: openDialog, close: closeDialog }] = useDisclosure(false);

    const { data: district } = useGetDistrictById(districtId);
    const { getSchools } = useGetSchools({ setSchool });
    const { importFromWord, importStatus } = useImportDistrictsWord();

    const [microModalOpened, { open: openMicroModal, close: closeMicroModal }] = useDisclosure(false);
    const [currentMicroTitle, setCurrentMicroTitle] = useState('');
    const { updateMicroDistrict } = useUpdateMicroDistrict();

    // Функция открытия модалки с выбранным микрорайоном
    const handleEditMicroDistrict = (title) => {
        setCurrentMicroTitle(title);
        openMicroModal();
    };

    // Функция переименования (обновляет локальное состояние школ)
    const handleRenameMicroDistrict = async (oldTitle, newTitle) => {
        if (!newTitle || newTitle === currentMicroTitle) return;

        // Обновляем локальное состояние
        setSchool(prev => prev.map(school =>
            school.microDistrictTitle === currentMicroTitle
                ? { ...school, microDistrictTitle: newTitle }
                : school
        ));

        // Обновляем в базе данных
        await updateMicroDistrict(oldTitle, newTitle);

        closeMicroModal();
    };


    // Фильтрация и сортировка школ
    const filteredSchool = useMemo(() => {
        let result = school;

        if (search.trim()) {
            const lowerSearch = search.trim().toLowerCase();
            result = result.filter(school =>
                school.schoolName?.toLowerCase().includes(lowerSearch) ||
                school.address?.toLowerCase().includes(lowerSearch) ||
                school.responsible?.toLowerCase().includes(lowerSearch) ||
                school.contacts?.toLowerCase().includes(lowerSearch) ||
                school.date?.toLowerCase().includes(lowerSearch) ||
                school.fioExecutor?.toLowerCase().includes(lowerSearch) ||
                school.note?.toLowerCase().includes(lowerSearch) ||
                school.microDistrictTitle?.toLowerCase().includes(lowerSearch)
            );
        }

        if (showOnlyCadetClasses) {
            result = result.filter(school => school.isCadetClass === true);
        }

        return result;
    }, [school, search, showOnlyCadetClasses]);

    // Сортировка: кадетские первыми, затем по названию организации
    const sortedAndFilteredSchool = useMemo(() => {
        return [...filteredSchool].sort((a, b) => {
            const cadetA = a.isCadetClass ? 1 : 0;
            const cadetB = b.isCadetClass ? 1 : 0;
            if (cadetB !== cadetA) return cadetB - cadetA;
            const nameA = a.schoolName?.toLowerCase() || '';
            const nameB = b.schoolName?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });
    }, [filteredSchool]);

    // Группировка по microDistrictTitle
    const groupedSchools = useMemo(() => {
        const groups = {};
        sortedAndFilteredSchool.forEach(school => {
            const key = school.microDistrictTitle?.trim() || withoutMicroDistrictTitle;
            if (!groups[key]) groups[key] = [];
            groups[key].push(school);
        });

        // Разделяем на группы с названиями и группу "Без микрорайона"
        const withNames = [];
        const withoutName = [];

        Object.entries(groups).forEach(([title, schools]) => {
            if (title === withoutMicroDistrictTitle) {
                withoutName.push({ title, schools });
            } else {
                withNames.push({ title, schools });
            }
        });

        // Сортируем группы с названиями по алфавиту
        withNames.sort((a, b) => a.title.localeCompare(b.title));

        // Сначала группы с названиями, потом "Без микрорайона"
        return [...withNames, ...withoutName];
    }, [sortedAndFilteredSchool]);

    const microDistrictsCount = useMemo(() => {
        return groupedSchools.filter(group => group.title !== withoutMicroDistrictTitle).length;
    }, [groupedSchools]);

    const microDistrictOptions = useMemo(() => {
        const options = school.map(s => s.microDistrictTitle).filter(Boolean);
        return [...new Set(options)];
    }, [school]);

    const { exportToWord } = useDownloadTableWord({ filteredSchool: sortedAndFilteredSchool, data: district });

    const onEditStudent = (e) => {
        setEditSchool(e.row);
        open();
    };

    useEffect(() => {
        getSchools(districtId);
    }, [districtId]);

    return (
        <Stack p={'xs'} style={{ flex: '1', height: '100%' }} bg={'green'}>
            <Group gap={'xl'} mb={'lg'}>
                <Stack c={'white'} gap={0}>
                    <Text fw={700}>{district?.name}</Text>
                </Stack>

                <Input
                    placeholder="Поиск..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    rightSectionPointerEvents="all"
                    style={{ flex: 1 }}
                    rightSection={
                        <CloseButton
                            onClick={() => setSearch("")}
                            style={{ display: search ? undefined : 'none' }}
                        />
                    }
                />

                <Button variant="white" onClick={open}>
                    Добавить организацию
                </Button>
            </Group>

            {search && <Text c={'white'} fw={700} size="xl">Поиск по: {search}</Text>}

            <Group justify="flex-end">
                <Checkbox
                    label={<Text c="white">СОШ с кадетскими классами</Text>}
                    size="xs"
                    color="indigo"
                    checked={showOnlyCadetClasses}
                    onChange={(event) => setShowOnlyCadetClasses(event.currentTarget.checked)}
                    styles={{
                        labelWrapper: { display: 'flex', alignItems: 'center' },
                        label: { paddingLeft: 8 },
                        body: { alignItems: 'center' }
                    }}
                />
            </Group>

            {/* Рендерим MicroTable для каждой группы */}
            <ScrollArea.Autosize flex={1}>
                <Stack>
                    {groupedSchools.map(({ title, schools }) => (
                        <MicroTable
                            key={title}
                            title={title}
                            schools={schools}
                            onRowClick={onEditStudent}
                            onEditMicroDistrict={handleEditMicroDistrict}
                        />
                    ))}
                </Stack>
            </ScrollArea.Autosize>

            <Group justify="flex-end" w="100%" mt={'5rem'}>
                <Text c={'white'} size="lg" fw={700}>Количество районов: {microDistrictsCount}</Text>
            </Group>

            <SchoolModal
                opened={opened}
                close={close}
                districtId={districtId}
                setSchool={setSchool}
                editSchool={editSchool}
                setEditSchool={setEditSchool}
                microDistrictOptions={microDistrictOptions}
            />

            <MicroDistrictTableModal
                opened={microModalOpened}
                onClose={closeMicroModal}
                currentTitle={currentMicroTitle}
                onRename={handleRenameMicroDistrict}
            />

            <Dialog opened={openedDialog} withCloseButton onClose={closeDialog} size="lg" radius="md">
                <Text size="sm" mb="xs" fw={500}>
                    {importStatus}
                </Text>
            </Dialog>
        </Stack>
    );
}