import { useState } from "react";

export default function useGetSchools({setSchools}) {
    const [error, setError] = useState(null);

    const getSchools = async (districtId) => {
        try {
            const { data, error } = await window.electronAPI.getAllSchools(districtId);
            setSchools((data || []).sort((a, b) => a.fio.localeCompare(b.fio)));
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

