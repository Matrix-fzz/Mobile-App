import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const PROPERTIES_API_URL = `${API_URL}/properties`;
const CATEGORIES_API_URL = `${API_URL}/categories`;

export function useCategoryProperties(category_id) {
  const [properties, setProperties] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!category_id) return;

    setLoading(true);
    setError(null);
    try {
      // ==> 1. KANJIBO LES DEUX EN PARALLÈLE <==
      const [propertiesResponse, categoryResponse] = await Promise.all([
        // Appel 1: Jib les properties li l category_id dyalhom howa hada
        axios.get(PROPERTIES_API_URL, { params: { category_id } }),
        // Appel 2: Jib smiyt l catégorie b l'ID dyalha
        axios.get(`${CATEGORIES_API_URL}/${category_id}`)
      ]);

      // Kanakhdo les données men les réponses
      setProperties(propertiesResponse.data);
      setCategoryName(categoryResponse.data.category_name);

    } catch (err) {
      console.error("Error fetching category properties:", err.response?.data || err.message);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [category_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ghadi nkhlliw ghir "refetch" bach ila bghina n3awdo nloadiw
  return { properties, categoryName, loading, error, refetch: fetchData };
}