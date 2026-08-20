import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const PROPERTIES_API_URL = `${API_URL}/properties`;

// L HOOK JDID DYALNA: Kay9bel les filtres b7al props
export const useProperties = (filters = {}) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Kan sifto les filtres direct l l backend
      const { data } = await axios.get(PROPERTIES_API_URL, { params: filters });
      setProperties(data);
    } catch (e) {
      setError('Failed to fetch properties.');
      console.error('Fetch Properties Error:', e.response?.data || e.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Only 'filters' is needed in the dependency array

  // useEffect(() => {
  //   fetchProperties();
  // }, [fetchProperties]);

  return { properties, isLoading, error, refetch: fetchProperties };
};