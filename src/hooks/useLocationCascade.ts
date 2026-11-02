'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getCountries,
  getStates,
  getCities,
  type StateOption,
} from '@/services/locationService';

export interface LocationCascadeLoadingState {
  countries: boolean;
  states: boolean;
  cities: boolean;
}

export interface UseLocationCascadeOptions {
  initialCountries?: string[];
  initialStates?: StateOption[];
  initialCities?: string[];
}


export function useLocationCascade({
  initialCountries = [],
  initialStates = [],
  initialCities = [],
}: UseLocationCascadeOptions = {}) {
  const [countries, setCountries] = useState<string[]>(initialCountries);
  const [states, setStates] = useState<StateOption[]>(initialStates);
  const [cities, setCities] = useState<string[]>(initialCities);

  const [loading, setLoading] = useState<LocationCascadeLoadingState>({
    countries: initialCountries.length === 0,
    states: false,
    cities: false,
  });

  const stateAbortRef = useRef<AbortController | null>(null);
  const cityAbortRef = useRef<AbortController | null>(null);

  // SSR fallback if countries list was empty
  useEffect(() => {
    let isSubscribed = true;
    if (countries.length === 0) {
      getCountries()
        .then((data) => {
          if (isSubscribed && data && data.length > 0) {
            setCountries(data);
          }
        })
        .finally(() => {
          if (isSubscribed) {
            setLoading((prev) => ({ ...prev, countries: false }));
          }
        });
    }
    return () => {
      isSubscribed = false;
    };
  }, [countries.length]);

  const loadStatesForCountry = useCallback(async (countryName: string) => {
    stateAbortRef.current?.abort();
    cityAbortRef.current?.abort();

    setStates([]);
    setCities([]);

    if (!countryName) {
      setLoading((prev) => ({ ...prev, states: false }));
      return;
    }

    const controller = new AbortController();
    stateAbortRef.current = controller;
    setLoading((prev) => ({ ...prev, states: true }));

    try {
      const data = await getStates(countryName, controller.signal);
      if (!controller.signal.aborted) {
        setStates(data);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading((prev) => ({ ...prev, states: false }));
      }
    }
  }, []);

  const loadCitiesForState = useCallback(async (countryName: string, stateName: string) => {
    cityAbortRef.current?.abort();

    setCities([]);

    if (!countryName || !stateName) {
      setLoading((prev) => ({ ...prev, cities: false }));
      return;
    }

    const controller = new AbortController();
    cityAbortRef.current = controller;
    setLoading((prev) => ({ ...prev, cities: true }));

    try {
      const data = await getCities(countryName, stateName, controller.signal);
      if (!controller.signal.aborted) {
        setCities(data);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    }
  }, []);

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      stateAbortRef.current?.abort();
      cityAbortRef.current?.abort();
    };
  }, []);

  const resetLocations = useCallback(() => {
    stateAbortRef.current?.abort();
    cityAbortRef.current?.abort();
    setStates([]);
    setCities([]);
    setLoading((prev) => ({ ...prev, states: false, cities: false }));
  }, []);

  return {
    countries,
    states,
    cities,
    loading,
    loadStatesForCountry,
    loadCitiesForState,
    resetLocations,
  };
}
