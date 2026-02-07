export default function useUpdateDistrict() {
    const updateDistrict = async (id, updatedDistrict) => {
        const { data } = await window.electronAPI.updateDistrict(id, updatedDistrict);
        return {
            data,
        }
    }

    return {
        updateDistrict,
    }
}

