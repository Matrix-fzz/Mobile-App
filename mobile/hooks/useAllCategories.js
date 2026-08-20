import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const CATEGORIES_API_URL = `${API_URL}/categories`;

export const useAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading] = useState(false);

  const fetchAllCategories = useCallback(async () => {
    try {
      // HNA MAKANSIFTO LA LIMIT LA WALO
      const { data } = await axios.get(CATEGORIES_API_URL);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching all categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  return { categories, isLoading, refresh: fetchAllCategories };
};