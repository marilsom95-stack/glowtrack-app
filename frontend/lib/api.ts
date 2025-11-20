import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { getToken } from './auth.js';

export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
};

export type AuthResponse = { user?: AuthUser } & Record<string, unknown>;

export type DiagnosisPayload = {
  questions?: string[];
  result?: {
    skinType?: string;
    summary?: string;
    recommendations?: string[];
  };
  selfieResult?: {
    headline?: string;
    summary?: string;
  };
};

export type RoutinePayload = {
  routines?: Array<{ id?: string; title?: string; steps?: string[] }>;
} & Record<string, unknown>;

export type WellbeingPayload = {
  glowScore?: number;
  checklist?: Array<{ id: string; label: string; completed?: boolean; progress?: number }>;
  timeline?: Array<{ title: string; time?: string; description?: string }>;
} & Record<string, unknown>;

export type ProgressPayload = {
  user?: { age?: string | number; skinType?: string; nationality?: string };
  progress?: { streak?: number };
  achievements?: string[];
  photos?: Array<{ url: string; label?: string }>;
} & Record<string, unknown>;

export type ProductPayload = {
  products?: Array<{ id: string; title?: string; subtitle?: string; price?: string; tags?: string[] }>;
} & Record<string, unknown>;

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

const withBaseUrl = (endpoint: string) => {
  if (endpoint.startsWith('http')) return endpoint;
  return `${apiBaseUrl}${endpoint}`;
};

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

export async function apiRequest<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(withBaseUrl(endpoint), {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = 'Falha na chamada ao GlowTrack.';
    try {
      const errorBody = (await response.json()) as { message?: string };
      message = errorBody.message || message;
    } catch (error) {
      console.error('Não foi possível ler o corpo do erro', error);
    }

    const error = new Error(message);
    throw error;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, init?: RequestInit) => apiRequest<T>(endpoint, { cache: 'no-store', ...(init || {}) }),
  post: <T>(endpoint: string, body: unknown, init?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...(init || {}),
    }),
  put: <T>(endpoint: string, body: unknown, init?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...(init || {}),
    }),
  getAuth: () => apiRequest<AuthResponse>('/api/auth', { cache: 'no-store' }),
  getDiagnosis: () => apiRequest<DiagnosisPayload>('/api/diagnosis', { cache: 'no-store' }),
  getRoutines: () => apiRequest<RoutinePayload>('/api/routines', { cache: 'no-store' }),
  getWellbeing: () => apiRequest<WellbeingPayload>('/api/wellbeing', { cache: 'no-store' }),
  updateWellbeing: (payload: Partial<WellbeingPayload>) =>
    apiRequest<WellbeingPayload>('/api/wellbeing', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getProgress: () => apiRequest<ProgressPayload>('/api/progress', { cache: 'no-store' }),
  createCheckIn: (payload: { mood: string; note?: string }) =>
    apiRequest<ProgressPayload>('/api/progress/check-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  addProgressPhoto: (payload: { url: string; label?: string }) =>
    apiRequest<ProgressPayload>('/api/progress/photos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getProducts: () => apiRequest<ProductPayload>('/api/products', { cache: 'no-store' }),
};

export type UseApiResponse<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
  mutate: SWRResponse<T, Error>['mutate'];
};

export function useApiData<T>(key: string | null, fetcher: () => Promise<T>, config?: SWRConfiguration<T, Error>): UseApiResponse<T> {
  const swr = useSWR<T, Error>(key, fetcher, config);

  return {
    data: swr.data,
    isLoading: swr.isLoading,
    error: swr.error,
    mutate: swr.mutate,
  };
}

export function useAuthData(config?: SWRConfiguration<AuthResponse, Error>) {
  return useApiData<AuthResponse>('/api/auth', api.getAuth, config);
}

export function useDiagnosisData(config?: SWRConfiguration<DiagnosisPayload, Error>) {
  return useApiData<DiagnosisPayload>('/api/diagnosis', api.getDiagnosis, config);
}

export function useWellbeingData(config?: SWRConfiguration<WellbeingPayload, Error>) {
  return useApiData<WellbeingPayload>('/api/wellbeing', api.getWellbeing, config);
}

export function useProgressData(config?: SWRConfiguration<ProgressPayload, Error>) {
  return useApiData<ProgressPayload>('/api/progress', api.getProgress, config);
}

export function useProductsData(config?: SWRConfiguration<ProductPayload, Error>) {
  return useApiData<ProductPayload>('/api/products', api.getProducts, config);
}

export function useLazyApi<T>(loader: () => Promise<T>, immediate = true) {
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!immediate) return;

    let isMounted = true;

    loader()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err as Error);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [immediate, loader]);

  return { data, isLoading, error } as const;
}
