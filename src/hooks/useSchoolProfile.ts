import { useEffect, useState } from 'react';
import { getSchoolProfile } from '../services/school.svc';
import type { ItemSekolahModel } from '../models/response';

interface UseSchoolProfileResult {
  school: ItemSekolahModel | null;
  nearbySchools: ItemSekolahModel[];
  loading: boolean;
  error: Error | null;
}

export const useSchoolProfile = (id: string | undefined): UseSchoolProfileResult => {
  const [school, setSchool] = useState<ItemSekolahModel | null>(null);
  const [nearbySchools, setNearbySchools] = useState<ItemSekolahModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { school: schoolData, nearbySchools: nearby } = await getSchoolProfile(id);
        
        setSchool(schoolData);
        setNearbySchools(nearby);
      } catch (err) {
        console.error('Failed to fetch school profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setSchool(null);
        setNearbySchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [id]);

  return { school, nearbySchools, loading, error };
};
