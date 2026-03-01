export default function useAddMicroDistrict() {
    const createMicroDistrict = async (districtObject) => {
        const {data, error} = await window.electronAPI.addMicroDistrict(districtObject);
        return {data, error};
    }

    return {
        createMicroDistrict,
    }
}

