import React, { useEffect, useState } from "react"
import { Button, CloseButton, Group, Input, Modal, Select, Stack } from "@mantine/core";
import { STATUS_SCHOOL, STATUS_SCHOOL_KURSANT } from "../consts";
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
}) {
    const [schoolName, setSchoolName] = useState(editSchool?.schoolName || '');
    const [classGroup, setClassGroup] = useState(editSchool?.classGroup || '');
    const [responsible, setResponsible] = useState(editSchool?.responsible || '');
    const [date, setDate] = useState(editSchool?.date || '');
    const [address, setAddress] = useState(editSchool?.address || '');

    const { addSchool } = useAddSchool();
    const { updateSchool } = useUpdateSchool();
    const { deleteSchool } = useDeleteSchool();

    const disabledButtonAdd = !schoolName || !responsible || !date || !classGroup || !address;
    const editButtonDisabled = disabledButtonAdd || (
        schoolName === editSchool.schoolName &&
        responsible === editSchool.responsible &&
        date === editSchool.date &&
        classGroup === editSchool.classGroup &&
        address === editSchool.address
    );

    const onCloseModal = () => {
        setSchoolName('');
        setClassGroup('');
        setResponsible('');
        setEditSchool({})
        close();
    }

    const handleAddSchool = async () => {
        const studentObject = {
            id: Date.now().toString(),
            districtId: districtId,
            schoolName,
            classGroup,
            responsible,
            date,
            address,
        }
        const { data } = await addSchool(studentObject);
        setSchool(prev => [...prev, data])
        onCloseModal();
        window.location.reload();
    }

    const handleEditSchool = async () => {
        const { data } = await updateSchool(editSchool.id, { schoolName, responsible, date, classGroup, address });
        setSchool(prevStudents => prevStudents.map(student => student.id === editSchool.id ? { ...student, ...data } : student))
        onCloseModal();
        window.location.reload();
    }

    const handleDeleteSchool = async () => {
        await deleteSchool(editSchool.id);
        setSchool(prevStudents => prevStudents.filter(student => student.id !== editSchool.id))
        onCloseModal();
        window.location.reload();
    }

    useEffect(() => {
        setSchoolName(editSchool?.schoolName || "");
        setClassGroup(editSchool?.classGroup || "");
        setResponsible(editSchool?.responsible || "");
        setDate(editSchool?.date || "");
        setAddress(editSchool?.address || "");
    }, [editSchool]);

    return (
        <>
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
                        <Input
                            placeholder="Название школы"
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
                    </Group>

                    <Group justify="space-between">
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
                        <Input
                            placeholder="Адресс"
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
                    </Group>

                    <Group grow>
                        {
                            editSchool?.id ?
                                <Button
                                    onClick={handleEditSchool}
                                    disabled={editButtonDisabled}
                                >
                                    Изменить
                                </Button> :
                                <Button
                                    onClick={handleAddSchool}
                                    disabled={disabledButtonAdd}
                                >
                                    Добавить
                                </Button>
                        }

                        {
                            editSchool?.id &&
                            <Button
                                onClick={handleDeleteSchool}
                                variant="outline"
                            >
                                Удалить
                            </Button>
                        }
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

