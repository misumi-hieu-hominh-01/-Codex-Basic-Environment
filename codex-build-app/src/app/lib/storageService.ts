import type { Item, StorageLocation } from "../types";

const BASE_API_URL = "http://localhost:5001/api";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : {
        "Content-Type": "application/json",
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
  return apiFetch<StorageLocation>("/locations", {
    method: "POST",
    body: JSON.stringify(location),
  });
}

export async function fetchItems(filters?: {
  unassigned?: boolean;
  barcode?: string;
}): Promise<Item[]> {
  const params = new URLSearchParams();
  if (filters?.unassigned) params.append("unassigned", "true");
  if (filters?.barcode) params.append("barcode", filters.barcode);
  const query = params.toString();
  const path = `/items${query ? `?${query}` : ""}`;
  return apiFetch<Item[]>(path);
}

export async function fetchItemById(id: string): Promise<Item> {
  return apiFetch<Item>(`/items/${id}`);
}

export async function addItem(itemData: {
  barcode: string;
  name: string;
  quantity: number;
  scannedAt: Date;
  metadata?: any;
  source?: "scan" | "manual";
}): Promise<Item> {
  const payload = {
    ...itemData,
    scannedAt: itemData.scannedAt.toISOString(),
  };
  return apiFetch<Item>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateItem(
  id: string,
  itemData: Partial<Item>
): Promise<Item> {
  return apiFetch<Item>(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(itemData),
  });
}

export async function deleteItem(id: string): Promise<void> {
  await apiFetch(`/items/${id}`, { method: "DELETE" });
}

export async function fetchLocations() {
  return apiFetch<StorageLocation[]>("/locations");
}

export async function fetchLocationById(id: string) {
  return apiFetch<StorageLocation>(`/locations/${id}`);
}

export async function addLocation(
  locationData: FormData | Partial<StorageLocation>
) {
  const isFormData =
    typeof FormData !== "undefined" && locationData instanceof FormData;
  return apiFetch<StorageLocation>("/locations", {
    method: "POST",
    body: isFormData ? locationData : JSON.stringify(locationData),
  });
}

export async function updateLocation(
  id: string,
  locationData: Partial<StorageLocation> | FormData
) {
  const isFormData =
    typeof FormData !== "undefined" && locationData instanceof FormData;
  return apiFetch<StorageLocation>(`/locations/${id}`, {
    method: "PUT",
    body: isFormData ? locationData : JSON.stringify(locationData),
  });
}

export async function deleteLocation(id: string) {
  return apiFetch<{ message: string }>(`/locations/${id}`, {
    method: "DELETE",
  });
}
