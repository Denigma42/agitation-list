export default function useGetDistricts({setDistricts}) {

    const getDistricts = async () => {
        const {data} = await window.electronAPI.getAllDistricts();
        setDistricts(data);
    }

    const getArchiveDistricts = async () => {
        const {data} = await window.electronAPI.getAllDistricts();
        setDistricts(data);
    }

    return {
        getDistricts,
        getArchiveDistricts
    }
}

