import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const CATEGORIES_API_URL = `${API_URL}/categories`;

export const useLimitedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading] = useState(false);

  const fetchLimitedCategories = useCallback(async () => {
    try {
      // HNA KANSIFTO LIMIT=10
      const { data } = await axios.get(CATEGORIES_API_URL, {
        params: { limit: 10 }
      });
      setCategories(data);
    } catch (error) {
      console.error('Error fetching limited categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchLimitedCategories();
  }, [fetchLimitedCategories]);

  return { categories, isLoading, refresh: fetchLimitedCategories };
};