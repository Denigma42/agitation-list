export default function useUpdateSchool() {
    const updateSchool = async (id, updatedSchool) => {
        const { data } = await window.electronAPI.updateSchool(id, updatedSchool);
        return {
            data,
        }
    }

    return {
        updateSchool,
    }
}

