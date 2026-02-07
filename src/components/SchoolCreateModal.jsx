import React, { useEffect, useState } from "react"
import { Button, CloseButton, Group, Input, Modal, Select, Stack } from "@mantine/core";
import { STATUS_SCHOOL, STATUS_SCHOOL_KURSANT } from "../consts";
import useAddSchool from "../hooks/useAddSchool";
import useUpdateSchool from "../hooks/useUpdateSchool";
import useDeleteSchool from "../hooks/useDeleteSchool";

export default function SchoolCreateModal({
    opened,
    close,
    districtId,
    setStudents,
    editStudent,
    setEditStudent,
}) {
    const [fio, setFio] = useState(editStudent?.fio || '');
    const [juniorCommander, setJuniorCommander] = useState(editStudent?.juniorCommander || '');
    const [fieldOfStudy, setFieldOfStudy] = useState(editStudent?.fieldOfStudy || '');
    const [status, setStatus] = useState(editStudent?.status || STATUS_SCHOOL[0]);

    const { addSchool } = useAddSchool();
    const { updateSchool } = useUpdateSchool();
    const { deleteSchool } = useDeleteSchool();

    const disabledButtonAdd = !fio || !fieldOfStudy || !status || !juniorCommander;
    const editButtonDisabled = disabledButtonAdd || (fio === editStudent.fio && fieldOfStudy === editStudent.fieldOfStudy && status === editStudent.status && juniorCommander === editStudent.juniorCommander);

    const onCloseModal = () => {
        setFio('');
        setJuniorCommander('');
        setFieldOfStudy('');
        setEditStudent({})
        close();
    }

    const handleAddStudent = async () => {
        const studentObject = {
            id: Date.now().toString(),
            districtId: districtId,
            fio,
            juniorCommander,
            fieldOfStudy,
            status,
            isInArchive: false,
        }
        const { data } = await addSchool(studentObject);
        setStudents(prev => [...prev, data])
        onCloseModal();
        window.location.reload();
    }

    const handleEditStudent = async () => {
        const { data } = await updateSchool(editStudent.id, { fio, fieldOfStudy, status, juniorCommander });
        setStudents(prevStudents => prevStudents.map(student => student.id === editStudent.id ? { ...student, ...data } : student))
        onCloseModal();
        window.location.reload();
    }

    const handleDeleteStudent = async () => {
        await deleteSchool(editStudent.id);
        setStudents(prevStudents => prevStudents.filter(student => student.id !== editStudent.id))
        onCloseModal();
        window.location.reload();
    }

    useEffect(() => {
        setFio(editStudent?.fio || "");
        setJuniorCommander(editStudent?.juniorCommander || "");
        setFieldOfStudy(editStudent?.fieldOfStudy || "");
        setStatus(editStudent?.status || STATUS_SCHOOL[0]);
    }, [editStudent]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={onCloseModal}
                size={'50%'}
                title={`${editStudent?.id ? "Изменить" : "Добавить"} школу`}
                centered
                closeOnClickOutside={false}
            >
                <Stack>
                    <Input
                        placeholder="ФИО"
                        value={fio}
                        onChange={(e) => setFio(e.target.value)}
                        data-autofocus
                        rightSectionPointerEvents="all"
                        rightSection={
                            <CloseButton
                                onClick={() => setFio("")}
                                style={{ display: fio ? undefined : 'none' }}
                            />
                        }
                    />

                    <Group justify="space-between">
                        <Input
                            placeholder="Уч. группа"
                            value={fieldOfStudy}
                            onChange={(e) => setFieldOfStudy(e.target.value.toUpperCase())}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setFieldOfStudy("")}
                                    style={{ display: fieldOfStudy ? undefined : 'none' }}
                                />
                            }

                        />
                        <Input
                            placeholder="Мл. командиры"
                            value={juniorCommander}
                            onChange={(e) => setJuniorCommander(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setJuniorCommander("")}
                                    style={{ display: juniorCommander ? undefined : 'none' }}
                                />
                            }
                        />
                        <Select
                            placeholder="Статус"
                            data={STATUS_SCHOOL}
                            value={status}
                            onChange={setStatus}
                        />
                    </Group>

                    <Group grow>
                        {
                            editStudent?.id ?
                                <Button
                                    onClick={handleEditStudent}
                                    disabled={editButtonDisabled}
                                >
                                    Изменить
                                </Button> :
                                <Button
                                    onClick={handleAddStudent}
                                    disabled={disabledButtonAdd}
                                >
                                    Добавить
                                </Button>
                        }

                        {
                            editStudent?.id &&
                            <Button
                                onClick={handleDeleteStudent}
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

