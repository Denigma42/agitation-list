import { useEffect, useState } from "react";
import { Dialog, Button, Group, Input, Modal, Select, Stack, Text, CloseButton } from "@mantine/core";
import { TYPE_DISTRICTS } from "../consts";
import { useDisclosure } from "@mantine/hooks";
import useAddDistrict from "../hooks/useAddDistrict";
import useUpdateDistrict from "../hooks/useUpdateDistrict";
import { useNavigate } from "react-router-dom";
import useDeleteDistrict from "../hooks/useDeleteDistrict";

export default function DistrictModal({
    opened,
    close,
    setDistricts,
    editDistrict,
    setEditDistrict,
    showOnlyArchive,
}) {
    const navigate = useNavigate();

    const [openedDialog, { toggle: openDialog, close: closeDialog }] = useDisclosure(false);
    const [districtName, setDistrictName] = useState(editDistrict?.districtName || "");
    const disabledButtonAdd = !districtName;
    const editButtonDisabled = disabledButtonAdd || (districtName === editDistrict?.districtName);

    const { createDistrict } = useAddDistrict();
    const { updateDistrict } = useUpdateDistrict();
    const { deleteDistrict } = useDeleteDistrict();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const onCloseModal = () => {
        setDistrictName("");
        setEditDistrict({});
        close();
    }

    const addDistrict = async () => {
        const districtObject = {
            id: Date.now().toString(),
            districtName: districtName,
            isInArchive: false,
        }
        const { data, error: addError } = await createDistrict(districtObject);
        if (addError) {
            openDialog();
            return;
        }
        setDistricts(prev => [...prev, data]);
        onCloseModal();
        navigate(`/${districtObject.id}`)
    }

    const handleEditDistrict = async () => {
        await updateDistrict(editDistrict.id, { districtName: districtName });
        //setDistricts(prevDistricts => prevDistricts.map(district => district.id === editPlatoon.id ? { ...district, ...data } : district))
        onCloseModal();
        window.location.reload()
    }

    const handleDeleteDistrict = () => {
        setDeleteInput("");
        setDeleteError("");
        setShowDeleteModal(true);
    }

    const confirmDeleteDistrict = async () => {
        if (deleteInput === String(editDistrict.districtName)) {
            await updateDistrict(editDistrict.id, { districtName: districtName, isInArchive: true, transferedAt: null });
            setDistricts(prevDistricts => prevDistricts.filter(district => district.id !== editDistrict.id))
            setShowDeleteModal(false);
            onCloseModal();
            navigate('/')
            window.location.reload();
        } else {
            setDeleteError('Неверно введён название района. Удаление отменено.');
        }
    }
    const cancelDeleteDistrict = () => {
        setShowDeleteModal(false);
        setDeleteInput("");
        setDeleteError("");
    }

    useEffect(() => {
        setDistrictName(editDistrict?.districtName || "");
    }, [editDistrict]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={onCloseModal}
                size={'40%'}
                title={`${editDistrict?.id ? "Изменить" : "Добавить"} район`}
                centered
                closeOnClickOutside={false}
            >
                <Stack>
                    {/* <Group justify="space-between">
                        <Select
                            placeholder="Тип района"
                            data={TYPE_DISTRICTS}
                            defaultValue={''}
                            value={typePlatoon}
                            onChange={setTypePlatoon}
                        />
                        <Input
                            placeholder="Номер района"
                            value={numberPlatoon}
                            onChange={(e) => setNumberPlatoon(e.target.value)}
                            rightSectionPointerEvents="all"
                            rightSection={
                                <CloseButton
                                    onClick={() => setNumberPlatoon("")}
                                    style={{ display: numberPlatoon ? undefined : 'none' }}
                                />
                            }
                        />
                    </Group> */}
                    <Input
                        placeholder="Название района"
                        value={districtName}
                        onChange={(e) => setDistrictName(e.target.value)}
                        rightSectionPointerEvents="all"
                        rightSection={
                            <CloseButton
                                onClick={() => setDistrictName("")}
                                style={{ display: districtName ? undefined : 'none' }}
                            />
                        }
                    />

                    <Group grow>
                        {
                            editDistrict?.id ?
                                <Button
                                    onClick={handleEditDistrict}
                                    disabled={editButtonDisabled}
                                >
                                    Изменить
                                </Button> :
                                <Button
                                    onClick={addDistrict}
                                    disabled={disabledButtonAdd}
                                >
                                    Добавить
                                </Button>
                        }

                        {
                            editDistrict?.id && !showOnlyArchive &&
                            <Button
                                onClick={handleDeleteDistrict}
                                variant="outline"
                            >
                                Удалить
                            </Button>
                        }

                        {
                            showOnlyArchive &&
                            <Button
                                onClick={async () => {
                                    await deleteDistrict(editDistrict.id);
                                    window.location.reload();
                                }}
                                variant="outline"
                            >
                                Удалить с архива
                            </Button>
                        }

                        {
                            showOnlyArchive &&
                            <Button
                                onClick={async () => {
                                    await updateDistrict(editDistrict.id, { districtName: districtName, isInArchive: false });
                                    window.location.reload();
                                }}
                                variant="outline"
                            >
                                Вернуть
                            </Button>
                        }
                    </Group>
                </Stack>
            </Modal>

            {/* Модальное окно удаления взвода */}
            <Modal opened={showDeleteModal} onClose={cancelDeleteDistrict} centered title="Удалить район?" size="md">
                <Stack>
                    <Text>Для подтверждения удаления введите название района: <b>{editDistrict?.districtName}</b></Text>
                    <Input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Введите название района..." />
                    {deleteError && <Text color="red" size="sm">{deleteError}</Text>}
                    <Group justify="flex-end">
                        <Button onClick={cancelDeleteDistrict} variant="default">Отменить</Button>
                        <Button onClick={confirmDeleteDistrict} color="red">Удалить</Button>
                    </Group>
                </Stack>
            </Modal>

            <Dialog opened={openedDialog} withCloseButton onClose={closeDialog} size="lg" radius="md">
                <Text size="sm" mb="xs" fw={500}>
                    Ошибка, такой район уже существует!
                </Text>
            </Dialog>
        </>
    );
}