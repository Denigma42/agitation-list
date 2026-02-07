export default function useDeleteAllArchivedDistricts() {
    const deleteAllArchivedDistricts = async () => {
        const result = await window.electronAPI.deleteAllArchivedDistricts();
        console.log(result);
        
        return result;
    };

    return {
        deleteAllArchivedDistricts,
    };
}

