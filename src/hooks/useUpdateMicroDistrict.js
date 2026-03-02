export default function useUpdateMicroDistrict() {
    const updateMicroDistrict = async (oldTitle, newTitle) => {
        const { data } = await window.electronAPI.updateMicroDistrict(oldTitle, newTitle);
        return {
            data,
        }
    }

    return {
        updateMicroDistrict,
    }
}

