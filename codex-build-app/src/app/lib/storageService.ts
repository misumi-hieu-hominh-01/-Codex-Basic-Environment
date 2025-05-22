import type { StorageLocation } from '../types';

const BASE_API_URL = 'http://localhost:5001/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function saveLocation(location: StorageLocation) {
  return apiFetch<StorageLocation>('/locations', {
    method: 'POST',
    body: JSON.stringify(location),
  });
}
