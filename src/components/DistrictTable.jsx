import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button, CloseButton, Dialog, Group, Input, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DataGrid } from "@mui/x-data-grid";
import useGetDistrictById from "../hooks/useGetDistrictById"
import useGetSchools from "../hooks/useGetSchools"
import SchoolModal from "./SchoolModal";
import useDownloadTableWord from "../hooks/useDownloadTableWord";
import useImportDistrictsWord from "../hooks/useImportDistrictsWord";
import { STATUS_SCHOOL } from "../consts"

const columns = [
    {
        field: 'order',
        headerName: '№',
        width: 60,
        headerAlign: 'center',
        align: 'center',
        resizable: false,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const allRowIds = params.api.getAllRowIds();
            return allRowIds.indexOf(params.id) + 1;
        }
    },
    {
        field: 'schoolName',
        headerName: 'Школа',
        headerAlign: 'center',
        align: 'left',
        flex: 0.4,
        resizable: false,
    },
    {
        field: 'classGroup',
        headerName: 'Класс',
        headerAlign: 'center',
        align: 'center',
        flex: 0.25,
        resizable: false,
    },
    {
        field: 'responsible',
        headerName: 'Ответственный',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        resizable: false,
    },
    {
        field: 'date',
        headerName: 'Дата',
        headerAlign: 'center',
        align: 'center',
        flex: 0.3,
        resizable: false,
        sortable: false
    },
    {
        field: 'address',
        headerName: 'Адрес',
        headerAlign: 'center',
        align: 'left',
        flex: 0.8,
        resizable: false,
    },
];

export default function DistrictTable() {
    const { id: districtId } = useParams();

    const [school, setSchool] = useState([]);
    const [editSchool, setEditSchool] = useState({});
    const [search, setSearch] = useState('');
    const [sortModel, setSortModel] = useState([{ field: 'fio', sort: 'asc' }]);

    const [opened, { open, close }] = useDisclosure(false);
    const [openedDialog, { toggle: openDialog, close: closeDialog }] = useDisclosure(false);

    const { data: district } = useGetDistrictById(districtId);
    const { getSchools } = useGetSchools({ setSchool });
    const { importFromWord, importStatus } = useImportDistrictsWord();

    const filteredSchool = useMemo(() => {
        if (!search.trim()) return school;
        const lowerSearch = search.trim().toLowerCase();
        return school.filter(school =>
            school.schoolName?.toLowerCase().includes(lowerSearch) ||
            school.classGroup?.toLowerCase().includes(lowerSearch) ||
            school.responsible?.toLowerCase().includes(lowerSearch) ||
            school.date?.toLowerCase().includes(lowerSearch) ||
            school.address?.toLowerCase().includes(lowerSearch)
        );
    }, [school, search]);
    
    const { exportToWord } = useDownloadTableWord({ filteredSchool, data: district });

    const onEditStudent = (e) => {
        setEditSchool(e.row);
        open();
    }

    useEffect(() => {
        getSchools(districtId);
        setSortModel([{ field: 'fio', sort: 'asc' }]);
    }, [districtId])

    return (
        <Stack p={'xs'} style={{ flex: '1', height: '100%' }} bg={'green'}>
            <Group gap={'xl'}>
                <Stack c={'white'} gap={0}>
                    <Text fw={700}>{district?.name}</Text>
                    {/* {data?.transferedAt && <Text fw={700}>Дата перевода: {data?.transferedAt ? new Date(data.transferedAt).toLocaleDateString() : ''}</Text>} */}
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

                <Button
                    variant="white"
                    onClick={open}
                >
                    Добавить школу
                </Button>
                {/* <Button
                    variant="white"
                    onClick={exportToWord}
                >
                    Скачать в Word
                </Button>
                <Button
                    variant="white"
                    component="label"
                >
                    Импорт из Word
                    <input
                        type="file"
                        hidden
                        accept=".docx"
                        onChange={(e) => {
                            importFromWord(e);
                            openDialog();
                        }}
                    />
                </Button> */}
            </Group>

            {search && <Text c={'white'} fw={700} size="xl">Поиск по: {search}</Text>}

            <ScrollArea.Autosize>
                <DataGrid
                    rows={filteredSchool}
                    columns={columns}
                    disableColumnMenu
                    hideFooter
                    onRowClick={onEditStudent}
                    disableRowSelectionOnClick
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}
                    sortingOrder={['asc', 'desc']}
                    getRowId={(row) => row.id}
                    getRowClassName={(params) => {
                        return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
                    }}
                    sx={{
                        border: 0,
                        '& .even': { backgroundColor: '#f2f2f2' },
                        '& .odd': { backgroundColor: '#ffffff' },
                        '& .not-enrolled': { backgroundColor: '#fa6666' },
                    }}
                />
            </ScrollArea.Autosize>

            <Group justify="flex-end" w="100%">
                <Text c={'white'} size="lg">Количество школ: {filteredSchool.length}</Text>
            </Group>

            <SchoolModal
                opened={opened}
                close={close}
                districtId={districtId}
                setSchool={setSchool}
                editSchool={editSchool}
                setEditSchool={setEditSchool}
            />

            <Dialog opened={openedDialog} withCloseButton onClose={closeDialog} size="lg" radius="md">
                <Text size="sm" mb="xs" fw={500}>
                    {importStatus}
                </Text>
            </Dialog>
        </Stack>
    );
}

