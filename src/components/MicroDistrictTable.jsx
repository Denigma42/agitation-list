import { ScrollArea, Stack, Text, Group, Button } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { schoolColumns, withoutMicroDistrictTitle } from "../consts";
import { MdModeEdit } from "react-icons/md";

export default function MicroTable({ title, schools, onRowClick, onEditMicroDistrict }) {
    return (
        <Stack gap="xs">
            <Group>
                <Text
                    fw={700}
                    size="lg"
                    c={title == withoutMicroDistrictTitle ? 'red.9' : "white"}
                >
                    {title}
                </Text>

                {title !== withoutMicroDistrictTitle &&
                    <Button
                        variant="white"
                        size="xs"
                        onClick={() => onEditMicroDistrict(title)}
                    >
                        <MdModeEdit />
                    </Button>
                }
            </Group>

            <ScrollArea.Autosize>
                <DataGrid
                    rows={schools}
                    columns={schoolColumns}
                    disableColumnMenu
                    hideFooter
                    onRowClick={onRowClick}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    getRowClassName={(params) => {
                        const evenOdd = params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
                        const cadet = params.row?.isCadetClass ? ' cadet-class' : '';
                        return evenOdd + cadet;
                    }}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.75rem', // можно изменить при необходимости
                        },
                        // Уменьшаем шрифт в заголовках
                        '& .MuiDataGrid-columnHeader': {
                            fontSize: '0.75rem',
                        },
                        border: 0,
                        '& .even': { backgroundColor: '#f2f2f2' },
                        '& .odd': { backgroundColor: '#ffffff' },
                        '& .not-enrolled': { backgroundColor: '#fa6666' },
                        '& .cadet-class': { backgroundColor: '#b3d4fc !important' },
                    }}
                />
            </ScrollArea.Autosize>

            <Group justify="flex-end" w="100%">
                <Text c={'white'} mr={'1rem'} size="lg">Количество организаций: {schools.length}</Text>
            </Group>
        </Stack>
    );
}