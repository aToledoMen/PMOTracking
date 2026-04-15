import { useEffect, useState } from 'react';
import { countries as mockCountries } from '@/data/mock-data';
import { fetchCountries } from '@/data/domo-api';
import type { Country } from '@/data/types';

export type CountriesSource = 'mock' | 'dataset';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(mockCountries);
  const [source, setSource] = useState<CountriesSource>('mock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCountries()
      .then(list => {
        if (!cancelled && list.length > 0) {
          setCountries(list);
          setSource('dataset');
        }
      })
      .catch(() => { /* keep mock */ })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { countries, source, loading };
}
