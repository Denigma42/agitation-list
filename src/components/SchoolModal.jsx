import React, { useEffect, useState } from "react";
import { Button, Checkbox, CloseButton, Group, Input, Modal, Stack, Text, Autocomplete } from "@mantine/core";
import useAddSchool from "../hooks/useAddSchool";
import useUpdateSchool from "../hooks/useUpdateSchool";
import useDeleteSchool from "../hooks/useDeleteSchool";

export default function SchoolModal({
    opened,
    close,
    districtId,
    setSchool,
    editSchool,
    setEditSchool,
    microDistrictOptions = [],
}) {
    const [schoolName, setSchoolName] = useState(editSchool?.schoolName || '');
    const [isCadetClass, setIsCadetClass] = useState(editSchool?.isCadetClass || false);
    const [classGroup, setClassGroup] = useState(editSchool?.classGroup || '');
    const [responsible, setResponsible] = useState(editSchool?.responsible || '');
    const [date, setDate] = useState(editSchool?.date || '');
    const [address, setAddress] = useState(editSchool?.address || '');
    const [microDistrictTitle, setMicroDistrictTitle] = useState(editSchool?.microDistrictTitle || '');

    const { addSchool } = useAddSchool();
    const { updateSchool } = useUpdateSchool();
    const { deleteSchool } = useDeleteSchool();

    const disabledButtonAdd = !schoolName || !responsible || !date || !classGroup || !address;
    const editButtonDisabled = disabledButtonAdd || (
        schoolName === editSchool.schoolName &&
        isCadetClass === editSchool.isCadetClass &&
        responsible === editSchool.responsible &&
        date === editSchool.date &&
        classGroup === editSchool.classGroup &&
        address === editSchool.address &&
        microDistrictTitle === editSchool.microDistrictTitle
    );

    const onCloseModal = () => {
        setSchoolName('');
        setIsCadetClass(false);
        setClassGroup('');
        setResponsible('');
        setDate('');
        setAddress('');
        setMicroDistrictTitle('');
        setEditSchool({});
        close();
    };

    const handleAddSchool = async () => {
        const schoolObject = {
            id: Date.now().toString(),
            districtId: districtId,
            schoolName,
            isCadetClass,
            classGroup,
            responsible,
            date,
            address,
            microDistrictTitle,
        };
        const { data } = await addSchool(schoolObject);
        setSchool(prev => [...prev, data]);
        onCloseModal();
        window.location.reload();
    };

    const handleEditSchool = async () => {
        const { data } = await updateSchool(editSchool.id, {
            schoolName,
            isCadetClass,
            responsible,
            date,
            classGroup,
            address,
            microDistrictTitle,
        });
        setSchool(prev => prev.map(s => s.id === editSchool.id ? { ...s, ...data } : s));
        onCloseModal();
        window.location.reload();
    };

    const handleDeleteSchool = async () => {
        const confirmed = window.confirm('Вы уверены, что хотите удалить эту школу?');
        if (!confirmed) return;

        await deleteSchool(editSchool.id);
        setSchool(prev => prev.filter(s => s.id !== editSchool.id));
        onCloseModal();
        window.location.reload();
    };

    useEffect(() => {
        setSchoolName(editSchool?.schoolName || "");
        setIsCadetClass(editSchool?.isCadetClass || false);
        setClassGroup(editSchool?.classGroup || "");
        setResponsible(editSchool?.responsible || "");
        setDate(editSchool?.date || "");
        setAddress(editSchool?.address || "");
        setMicroDistrictTitle(editSchool?.microDistrictTitle || "");
    }, [editSchool]);

    return (
        <Modal
            opened={opened}
            onClose={onCloseModal}
            size={'50%'}
            title={`${editSchool?.id ? "Изменить" : "Добавить"} школу`}
            centered
            closeOnClickOutside={false}
        >
            <Stack>
                <Group justify="space-between" grow>
                    <Stack gap={0}>
                        <Text size="sm" c={'gray.7'} fs="italic">Наименование организации</Text>
                        <Input
                            placeholder="Наименование организации"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            data-autofocus
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setSchoolName("")}
                                    style={{ display: schoolName ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>

                    <Stack gap={0}>
                        <Text size="sm" c={'gray.7'} fs="italic">Ответственный</Text>
                        <Input
                            placeholder="Ответственный"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setResponsible("")}
                                    style={{ display: responsible ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>
                </Group>

                <Group justify="space-between" grow>
                    <Stack gap={0}>
                        <Checkbox
                            label="Это кадетский класс?"
                            size="xs"
                            mb={'xs'}
                            checked={isCadetClass}
                            onChange={(event) => setIsCadetClass(event.currentTarget.checked)}
                        />
                        <Input
                            placeholder="Класс"
                            value={classGroup}
                            onChange={(e) => setClassGroup(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setClassGroup("")}
                                    style={{ display: classGroup ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>
                    <Stack gap={0}>
                        <Text size="sm" c={'gray.7'} fs="italic">Адрес</Text>
                        <Input
                            placeholder="Адрес"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setAddress("")}
                                    style={{ display: address ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>
                    <Stack gap={0}>
                        <Text size="sm" c={'gray.7'} fs="italic">Дата</Text>
                        <Input
                            placeholder="Дата"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setDate("")}
                                    style={{ display: date ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>
                </Group>

                {/* Поле микрорайона с автодополнением */}
                <Group>
                    <Stack gap={0} style={{ flex: 1 }}>
                        <Text size="sm" c={'gray.7'} fs="italic">Микрорайон</Text>
                        <Autocomplete
                            placeholder="Название микрорайона"
                            value={microDistrictTitle}
                            onChange={setMicroDistrictTitle}
                            data={microDistrictOptions}
                            rightSection={
                                <CloseButton
                                    onClick={() => setMicroDistrictTitle("")}
                                    style={{ display: microDistrictTitle ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>
                </Group>

                <Group grow>
                    {editSchool?.id ? (
                        <Button onClick={handleEditSchool} disabled={editButtonDisabled}>
                            Изменить
                        </Button>
                    ) : (
                        <Button onClick={handleAddSchool} disabled={disabledButtonAdd}>
                            Добавить
                        </Button>
                    )}

                    {editSchool?.id && (
                        <Button onClick={handleDeleteSchool} variant="outline">
                            Удалить
                        </Button>
                    )}
                </Group>
            </Stack>
        </Modal>
    );
}