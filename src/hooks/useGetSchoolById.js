import { useEffect, useState } from "react";

export default function useGetSchoolById(id) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        window.electronAPI.getSchoolById(id)
            .then(({ data }) => setData(data))
            .catch(setError);
    }, [id]);

    return { data, error };
}

