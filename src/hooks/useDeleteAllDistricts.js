export default function useDeleteAllDistricts() {
    const deleteAllDistricts = async () => {
        const result = await window.electronAPI.deleteAllDistricts();
        return result;
    };

    return {
        deleteAllDistricts,
    };
}

