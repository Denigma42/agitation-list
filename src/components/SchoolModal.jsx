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
    console.log(editSchool);
    
    const [schoolName, setSchoolName] = useState(editSchool?.schoolName || '');
    const [address, setAddress] = useState(editSchool?.address || '');
    const [isCadetClass, setIsCadetClass] = useState(editSchool?.isCadetClass || false);
    const [responsible, setResponsible] = useState(editSchool?.responsible || '');
    const [contacts, setContacts] = useState(editSchool?.contacts || '');
    const [date, setDate] = useState(editSchool?.date || '');
    const [fioExecutor, setFioExecutore] = useState(editSchool?.fioExecutor || '');
    const [note, setNote] = useState(editSchool?.note || '');
    const [microDistrictTitle, setMicroDistrictTitle] = useState(editSchool?.microDistrictTitle || '');

    const { addSchool } = useAddSchool();
    const { updateSchool } = useUpdateSchool();
    const { deleteSchool } = useDeleteSchool();

    const disabledButtonAdd = !schoolName || !address || !responsible || !contacts || !date || !fioExecutor
    const editButtonDisabled = disabledButtonAdd || (
        schoolName === editSchool.schoolName &&
        isCadetClass === editSchool.isCadetClass &&
        responsible === editSchool.responsible &&
        date === editSchool.date &&
        contacts === editSchool.contacts &&
        address === editSchool.address &&
        fioExecutor === editSchool.fioExecutor &&
        note === editSchool.note &&
        microDistrictTitle === editSchool.microDistrictTitle
    );

    const onCloseModal = () => {
        setSchoolName('');
        setIsCadetClass(false);
        setContacts('');
        setResponsible('');
        setDate('');
        setAddress('');
        setFioExecutore('')
        setNote('')
        setMicroDistrictTitle('');
        setEditSchool({});
        close();
    };

    const handleAddSchool = async () => {
        const schoolObject = {
            id: Date.now().toString(),
            districtId: districtId,
            schoolName,
            address,
            isCadetClass,
            responsible,
            contacts,
            date,
            fioExecutor,
            note,
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
            address,
            isCadetClass,
            responsible,
            contacts,
            date,
            fioExecutor,
            note,
            microDistrictTitle,
        });
        setSchool(prev => prev.map(s => s.id === editSchool.id ? { ...s, ...data } : s));
        onCloseModal();
        window.location.reload();
    };

    const handleDeleteSchool = async () => {
        const confirmed = window.confirm('Вы уверены, что хотите удалить эту организацию?');
        if (!confirmed) return;

        await deleteSchool(editSchool.id);
        setSchool(prev => prev.filter(s => s.id !== editSchool.id));
        onCloseModal();
        window.location.reload();
    };

    useEffect(() => {
        setSchoolName(editSchool?.schoolName || "");
        setIsCadetClass(editSchool?.isCadetClass || false);
        setContacts(editSchool?.contacts || "");
        setResponsible(editSchool?.responsible || "");
        setDate(editSchool?.date || "");
        setAddress(editSchool?.address || "");
        setFioExecutore(editSchool?.fioExecutor || "");
        setNote(editSchool?.note || "");
        setMicroDistrictTitle(editSchool?.microDistrictTitle || "");
    }, [editSchool]);

    return (
        <Modal
            opened={opened}
            onClose={onCloseModal}
            size={'50%'}
            title={`${editSchool?.id ? "Изменить" : "Добавить"} организацию`}
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
                        <Text size="sm" c={'gray.7'} fs="italic">Ответственный за проф ориентацию</Text>
                        <Input
                            placeholder="Ответственный за проф ориентацию"
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
                            placeholder="Контактный телефон"
                            value={contacts}
                            onChange={(e) => setContacts(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setContacts("")}
                                    style={{ display: contacts ? undefined : 'none' }}
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
                        <Text size="sm" c={'gray.7'} fs="italic">Дата посещения</Text>
                        <Input
                            placeholder="Дата посещения"
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

                <Group justify="space-between" grow>
                    <Stack gap={0}>
                        <Text size="sm" c={'gray.7'} fs="italic">ФИО исполнителя</Text>
                        <Input
                            placeholder="ФИО исполнителя"
                            value={fioExecutor}
                            onChange={(e) => setFioExecutore(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setFioExecutore("")}
                                    style={{ display: fioExecutor ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>

                    <Stack gap={0}>
                        <Text size="sm" c={'gray.7'} fs="italic">Примечание (необязательно)</Text>
                        <Input
                            placeholder="Примечание"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setNote("")}
                                    style={{ display: note ? undefined : 'none' }}
                                />
                            }
                        />
                    </Stack>
                </Group>

                {/* Поле микрорайона с автодополнением */}
                <Group>
                    <Stack gap={0} style={{ flex: 1 }}>
                        <Text size="sm" c={'gray.7'} fs="italic">Район (необязательно)</Text>
                        <Autocomplete
                            placeholder="Название района"
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