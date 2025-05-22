import type { StorageLocation } from '../types';

const BASE_API_URL = 'http://localhost:5001/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

  const response = await fetch(`${BASE_API_URL}${path}`, {
    headers,
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

export async function fetchLocations() {
  return apiFetch<StorageLocation[]>('/locations');
}

export async function fetchLocationById(id: string) {
  return apiFetch<StorageLocation>(`/locations/${id}`);
}

export async function addLocation(
  locationData: FormData | Partial<StorageLocation>
) {
  const isFormData =
    typeof FormData !== 'undefined' && locationData instanceof FormData;
  return apiFetch<StorageLocation>('/locations', {
    method: 'POST',
    body: isFormData ? locationData : JSON.stringify(locationData),
  });
}

export async function updateLocation(
  id: string,
  locationData: Partial<StorageLocation> | FormData
) {
  const isFormData =
    typeof FormData !== 'undefined' && locationData instanceof FormData;
  return apiFetch<StorageLocation>(`/locations/${id}`, {
    method: 'PUT',
    body: isFormData ? locationData : JSON.stringify(locationData),
  });
}

export async function deleteLocation(id: string) {
  return apiFetch<{ message: string }>(`/locations/${id}`, {
    method: 'DELETE',
  });
}
