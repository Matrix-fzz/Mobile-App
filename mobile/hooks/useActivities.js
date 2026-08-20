// hooks/
import axios from 'axios';
import { useEffect, useState } from 'react';

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.100.6:5001/messages/messages'); // replace URL
        setActivities(response.data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};

export default useActivities;
