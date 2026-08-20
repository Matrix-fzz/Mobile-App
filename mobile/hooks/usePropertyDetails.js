import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const PROPERTIES_API_URL = `${API_URL}/properties`;

export default function usePropertyDetails(propertyId) {
  // 1. Ghadi nb9aw nkhzno kolchi f state we7da "details"
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // Ila l'ID makanch, man dir walo
    if (!propertyId) {
        setLoading(false);
        return;
    };

    setLoading(true);
    setError(null);
    try {
      // 2. Kandiro APPEL API WE7ED SGHIR O M'CIBLI
      // L backend ghayrjje3 lina objet fih (property, media, features, owner)
      const { data } = await axios.get(`${PROPERTIES_API_URL}/${propertyId}`);
      setDetails(data);
    } catch (err) {
      console.error('Error fetching property details:', err.response?.data || err.message);
      setError("Failed to load property details.");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Kanrje3o l'objet "details" kaml
  return { details, loading, error, refetch: fetchData };
}