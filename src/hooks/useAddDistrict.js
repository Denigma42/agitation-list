export default function useAddDistrict() {
    const createDistrict = async (districtObject) => {
        const {data, error} = await window.electronAPI.addDistrict(districtObject);
        return {data, error};
    }

    return {
        createDistrict,
    }
}

