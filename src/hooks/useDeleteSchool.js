export default function useDeleteSchool() {
    const deleteSchool = async (id) => {
        const result = await window.electronAPI.deleteSchool(id);
        return result;
    };

    return {
        deleteSchool,
    };
}

