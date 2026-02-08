import { useState } from "react";

export default function useGetSchools({setSchool}) {
    const [error, setError] = useState(null);

    const getSchools = async (districtId) => {
        try {
            const { data, error } = await window.electronAPI.getAllSchools(districtId);
            setSchool(data);
            setError(error || null);
        } catch (e) {
            setError(e);
        }
    };

    return {
        getSchools,
        error,
    };
}

