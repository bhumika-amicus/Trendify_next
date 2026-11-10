'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  getCountries,
  getStates,
  getCities,
  isAbortError,
  type StateOption,
} from '@/services/locationService';

export interface LocationCascadeLoadingState {
  countries: boolean;
  states: boolean;
  cities: boolean;
}

export interface LocationCascadeErrorState {
  countries: string | null;
  states: string | null;
  cities: string | null;
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

  const [error, setError] = useState<LocationCascadeErrorState>({
    countries: null,
    states: null,
    cities: null,
  });

  const stateAbortRef = useRef<AbortController | null>(null);
  const cityAbortRef = useRef<AbortController | null>(null);

  const loadCountries = useCallback(async () => {
    setLoading((prev) => ({ ...prev, countries: true }));
    setError((prev) => ({ ...prev, countries: null }));

    try {
      const data = await getCountries();
      if (data && data.length > 0) {
        setCountries(data);
      }
    } catch (err: unknown) {
      if (!isAbortError(err)) {
        setError((prev) => ({ ...prev, countries: 'Unable to load countries' }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  }, []);

  // SSR fallback if countries list was empty
  useEffect(() => {
    let isSubscribed = true;
    if (countries.length === 0) {
      getCountries()
        .then((data) => {
          if (isSubscribed && data && data.length > 0) {
            setCountries(data);
            setError((prev) => ({ ...prev, countries: null }));
          }
        })
        .catch((err: unknown) => {
          if (isSubscribed && !isAbortError(err)) {
            setError((prev) => ({ ...prev, countries: 'Unable to load countries' }));
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

    if (!countryName) {
      setStates([]);
      setCities([]);
      setError((prev) => ({ ...prev, states: null, cities: null }));
      setLoading((prev) => ({ ...prev, states: false, cities: false }));
      return;
    }

    setStates([]);
    setCities([]);

    const controller = new AbortController();
    stateAbortRef.current = controller;
    setLoading((prev) => ({ ...prev, states: true }));
    setError((prev) => ({ ...prev, states: null, cities: null }));

    try {
      const data = await getStates(countryName, controller.signal);
      if (!controller.signal.aborted) {
        setStates(data);
      }
    } catch (err: unknown) {
      if (!isAbortError(err)) {
        setError((prev) => ({ ...prev, states: 'Unable to load states' }));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading((prev) => ({ ...prev, states: false }));
      }
    }
  }, []);

  const loadCitiesForState = useCallback(async (countryName: string, stateName: string) => {
    cityAbortRef.current?.abort();

    if (!countryName || !stateName) {
      setCities([]);
      setError((prev) => ({ ...prev, cities: null }));
      setLoading((prev) => ({ ...prev, cities: false }));
      return;
    }

    setCities([]);

    const controller = new AbortController();
    cityAbortRef.current = controller;
    setLoading((prev) => ({ ...prev, cities: true }));
    setError((prev) => ({ ...prev, cities: null }));

    try {
      const data = await getCities(countryName, stateName, controller.signal);
      if (!controller.signal.aborted) {
        setCities(data);
      }
    } catch (err: unknown) {
      if (!isAbortError(err)) {
        setError((prev) => ({ ...prev, cities: 'Unable to load cities' }));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    }
  }, []);

  // Atomic loader for prefilled / edit addresses to prevent race conditions
  const loadAddressLocations = useCallback(async (countryName: string, stateName?: string) => {
    stateAbortRef.current?.abort();
    cityAbortRef.current?.abort();

    if (!countryName) {
      setStates([]);
      setCities([]);
      setError({ countries: null, states: null, cities: null });
      setLoading((prev) => ({ ...prev, states: false, cities: false }));
      return;
    }

    const stateCtrl = new AbortController();
    stateAbortRef.current = stateCtrl;

    const cityCtrl = stateName ? new AbortController() : null;
    if (cityCtrl) {
      cityAbortRef.current = cityCtrl;
    }

    setLoading((prev) => ({ ...prev, states: true, cities: !!stateName }));
    setError((prev) => ({ ...prev, states: null, cities: null }));

    // Fetch states
    const statesPromise = getStates(countryName, stateCtrl.signal)
      .then((data) => {
        if (!stateCtrl.signal.aborted) {
          setStates(data);
        }
      })
      .catch((err: unknown) => {
        if (!isAbortError(err)) {
          setError((prev) => ({ ...prev, states: 'Unable to load states' }));
        }
      })
      .finally(() => {
        if (!stateCtrl.signal.aborted) {
          setLoading((prev) => ({ ...prev, states: false }));
        }
      });

    // Concurrently fetch cities if state is known, without cross-aborting
    const citiesPromise = (async () => {
      if (!stateName || !cityCtrl) return;
      try {
        const citiesData = await getCities(countryName, stateName, cityCtrl.signal);
        if (!cityCtrl.signal.aborted) {
          setCities(citiesData);
        }
      } catch (err: unknown) {
        if (!isAbortError(err)) {
          setError((prev) => ({ ...prev, cities: 'Unable to load cities' }));
        }
      } finally {
        if (!cityCtrl.signal.aborted) {
          setLoading((prev) => ({ ...prev, cities: false }));
        }
      }
    })();

    await Promise.allSettled([statesPromise, citiesPromise]);
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
    setError({ countries: null, states: null, cities: null });
    setLoading((prev) => ({ ...prev, states: false, cities: false }));
  }, []);

  return {
    countries,
    states,
    cities,
    loading,
    error,
    loadCountries,
    loadStatesForCountry,
    loadCitiesForState,
    loadAddressLocations,
    resetLocations,
  };
}
