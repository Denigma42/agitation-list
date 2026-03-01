import { Modal, Input, Button, Group, Stack } from "@mantine/core";
import { useState, useEffect } from "react";

export default function MicroDistrictTableModal({ opened, onClose, currentTitle, onRename }) {
    const [newTitle, setNewTitle] = useState(currentTitle);

    useEffect(() => {
        setNewTitle(currentTitle);
    }, [currentTitle]);

    const isSaveDisabled = !newTitle?.trim() || newTitle.trim() === currentTitle;

    const handleSave = () => {
        if (!isSaveDisabled) {
            onRename(newTitle.trim());
        }
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Редактирование микрорайона"
            centered
            closeOnClickOutside={false}
        >
            <Stack>
                <Input
                    placeholder="Название микрорайона"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    data-autofocus
                />
                <Group justify="flex-end">
                    <Button variant="outline" onClick={onClose}>Отмена</Button>
                    <Button onClick={handleSave} disabled={isSaveDisabled}>
                        Сохранить
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}