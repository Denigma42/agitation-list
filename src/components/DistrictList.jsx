import { useEffect, useState } from "react";
import { Menu, Button, Group, ScrollArea, Stack, Text, CloseButton, Input, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { CiViewTable } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { FaBoxArchive } from "react-icons/fa6";
import DistrictModal from "./DistrictModal";
import { TYPE_DISTRICTS } from "../consts";
import useGetDistricts from "../hooks/useGetDistricts";
import DrawerTable from "./DrawerTable";
import useGetSchools from "../hooks/useGetSchools";
import SettingsModal from "./SettingsModal";
import useDeleteAllArchivedDistricts from "../hooks/useDeleteAllArchivedDistricts";

export default function DistrictList() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [districts, setDistricts] = useState([]);
    const [schools, setSchools] = useState([]);
    const [value, setValue] = useState('');
    const [editDistrict, setEditDistrict] = useState({});
    //const [showOnlyArchive, setShowOnlyArchive] = useState(false);

    const [openedModal, modal] = useDisclosure(false);
    const [openedModalSettings, modalSettings] = useDisclosure(false);
    //const [openedDrawer, drawer] = useDisclosure(false);

    const { getDistricts } = useGetDistricts({ setDistricts });
    const { getSchools } = useGetSchools({ setSchools });
    const { deleteAllArchivedDistricts } = useDeleteAllArchivedDistricts();

    const clearArchivedPlatoons = async () => {
        if (confirm("Вы уверены, что хотите очистить архив?")) {
            await deleteAllArchivedDistricts();
            window.location.reload();
        }
    }

    useEffect(() => {
        getDistricts();
        getSchools();
    }, [])

    return (
        <Stack align="center" p={'xs'}>
            <Stack gap={0}>
                <Text fw={700} size="xl" mb={'md'}>Районы</Text>

                <Group
                    align="center"
                    mb={'xl'}
                >
                    <Input
                        placeholder="Поиск..."
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                        rightSectionPointerEvents="all"
                        rightSection={
                            <CloseButton
                                onClick={() => setValue('')}
                                style={{ display: value ? undefined : 'none' }}
                            />
                        }
                    />
                    <Button variant="outline" onClick={modal.open}>
                        +
                    </Button>
                </Group>

                {/* {showOnlyArchive &&
                    <Group mb={'xl'}>
                        <Text fw={700} size="40px">Архив</Text>
                        <Button
                            onClick={clearArchivedPlatoons}
                            color={showOnlyArchive && 'orange'}
                        >
                            Очистить архив
                        </Button>
                    </Group>
                } */}

                {value && <Text fw={700} size="xl" mb={'xl'}>Поиск по: {value}</Text>}

                <ScrollArea.Autosize
                    mah="calc(90vh - 150px)"
                    type={"never"}
                >
                    {/* {TYPE_DISTRICTS.map((type) => {
                        const platoonsOfType = platoons
                            .filter((platoon) => platoon.type === type)
                            .filter((platoon) => {
                                const lowerValue = value.toLowerCase();
                                const numberMatch = platoon.number.toString().includes(value);
                                const officerMatch = platoon.officer?.toLowerCase().includes(lowerValue);
                                const studentsOfPlatoon = students.filter(s => s.districtId === platoon.id);
                                const studentMatch = studentsOfPlatoon.some(s => s.fio.toLowerCase().includes(lowerValue));
                                return numberMatch || officerMatch || studentMatch;
                            })
                            .filter((platoon) => showOnlyArchive ? platoon.isInArchive === true : !platoon.isInArchive)
                            .sort((a, b) => a.number - b.number);
                        if (platoonsOfType.length === 0) return null;
                        return (
                            <Stack align="center" key={type} mb={'xl'}>
                                <Text>{type}</Text>
                                {platoonsOfType.map((platoon) => (
                                    <Group w={'100%'} key={platoon.id}>
                                        <Button
                                            flex={1}
                                            onClick={() => navigate(`${platoon.id}`)}
                                            disabled={platoon.id === id}
                                            color={showOnlyArchive && 'orange'}
                                        >
                                            {platoon.number}
                                        </Button>
                                        {
                                            id === platoon.id &&
                                            <Button
                                                onClick={() => {
                                                    setEditPlatoon(platoon);
                                                    modal.open();
                                                }}
                                                color={showOnlyArchive && 'orange'}
                                            >
                                                <MdModeEdit />
                                            </Button>
                                        }
                                    </Group>
                                ))}
                            </Stack>
                        );
                    })} */}

                    {
                        districts.map((district) => (
                            <Group w={'100%'} key={district.id} mb={'sm'}>
                                <Button
                                    flex={1}
                                    onClick={() => navigate(`/${district.id}`)}
                                    disabled={district.id === id}
                                >
                                    {district.name}
                                </Button>
                                {
                                    id === district.id &&
                                    <Button
                                        onClick={() => {
                                            setEditDistrict(district);
                                            modal.open();
                                        }}
                                    >
                                        <MdModeEdit />
                                    </Button>
                                }
                            </Group>
                        ))
                    }

                    {districts.every(district => district.name?.toLowerCase().includes(value.toLowerCase())) && (
                        <Text align="center" c="dimmed" mt="md">Районы не найдены</Text>
                    )}
                </ScrollArea.Autosize>
            </Stack>

            <DistrictModal
                opened={openedModal}
                close={modal.close}
                setDistricts={setDistricts}
                editDistrict={editDistrict}
                setEditDistrict={setEditDistrict}
                showOnlyArchive={false}
            />

            <SettingsModal
                opened={openedModalSettings}
                close={modalSettings.close}
                quantityPlatoons={districts.length}
            />

            {/* <DrawerTable
                openedDrawer={openedDrawer}
                drawer={drawer}
                platoons={platoons}
                students={students}
            /> */}
        </Stack >
    );
}

