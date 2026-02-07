export default function useAddSchool() {
    const addSchool = async (schoolObject) => {
        const { data, error } = await window.electronAPI.addSchool(schoolObject);
        return { data, error };
    };

    return {
        addSchool,
    };
}

