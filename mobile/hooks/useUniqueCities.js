import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // KANJIBO L'URL MEN CONFIG

const PROPERTIES_API_URL = `${API_URL}/properties`;

const MAJOR_CITIES = [
    'Marrakech', 'Casablanca', 'Rabat', 'Fez', 'Tangier', 'Agadir', 'Meknes', 'Tetouan'
];

export const useUniqueCities = () => {
    const [allCities, setAllCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUniqueCities = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${PROPERTIES_API_URL}/cities`);
            
          
            setAllCities(data);

        } catch (e) {
            console.error('Error in useUniqueCities hook:', e.response?.data || e.message);
            setError(e.response?.data?.message || 'Failed to fetch cities.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUniqueCities();
    }, [fetchUniqueCities]);

    // L logic dyal l "ferz" (triage) kayb9a kima howa, howa déja mzyan
    const majorCities = allCities
        .filter(city => MAJOR_CITIES.includes(city))
        .sort((a, b) => MAJOR_CITIES.indexOf(a) - MAJOR_CITIES.indexOf(b));

    const otherCities = allCities
        .filter(city => !MAJOR_CITIES.includes(city))
        .sort((a, b) => a.localeCompare(b));

    return {
        majorCities,
        otherCities,
        isLoading,
        error
    };
};