export default function useDeleteMicroDistrict() {
    const deleteMicroDistrict = async (id) => {
        const result = await window.electronAPI.deleteMicroDistrict(id);
        return result;
    };

    return {
        deleteMicroDistrict,
    };
}

