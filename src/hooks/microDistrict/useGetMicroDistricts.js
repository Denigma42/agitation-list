// hooks/useGetMicroDistricts.js
import { useState, useCallback } from 'react';

export default function useGetMicroDistricts() {
    const [microDistricts, setMicroDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getMicroDistricts = useCallback(async (districtId) => {
        setLoading(true);
        try {
            const { data, error } = await window.electronAPI.getAllMicroDistricts(districtId);
            if (error) throw new Error(error);
            setMicroDistricts(data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { microDistricts, loading, error, getMicroDistricts };
}