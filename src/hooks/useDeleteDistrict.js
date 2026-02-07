export default function useDeleteDistrict() {
    const deleteDistrict = async (id) => {
        const result = await window.electronAPI.deleteDistrict(id);
        return result;
    };

    return {
        deleteDistrict,
    };
}

