export default function useUpdateMicroDistrict() {
    const updateMicroDistrict = async (id, updatedDistrict) => {
        const { data } = await window.electronAPI.updateMicroDistrict(id, updatedDistrict);
        return {
            data,
        }
    }

    return {
        updateMicroDistrict,
    }
}

