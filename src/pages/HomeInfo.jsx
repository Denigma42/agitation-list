import { Text, Group, Stack, Button, Dialog } from "@mantine/core";
import useImportDistrictsWord from "../hooks/useImportDistrictsWord";
import { useDisclosure } from "@mantine/hooks";

function HomeInfo() {
  // const [openedDialog, { toggle: openDialog, close: closeDialog }] = useDisclosure(false);
  // const { importFromWord, importStatus } = useImportPlatoonsWord();

  return (
    <Group h="100%" px="md" justify="center">
      <Stack align="center">
        <Text >Выберите район</Text>
        {/* <Text >или</Text>
        <Button
        >
          Импорт из Worddsdsd
          <input
            type="file"
            hidden
            //accept=".docx"
            onChange={(e) => {
              importFromWord(e);
              openDialog();
            }}
          />
        </Button> */}
        {/* {importStatus && <Text c="yellow" fw={700}>{importStatus}</Text>} */}
      </Stack>

      {/* <Dialog opened={openedDialog} withCloseButton onClose={closeDialog} size="lg" radius="md">
        <Text size="sm" mb="xs" fw={500}>
          {importStatus}
        </Text>
      </Dialog> */}
    </Group>
  );
}

export default HomeInfo;
