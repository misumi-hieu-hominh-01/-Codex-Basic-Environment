const SALES_ORDER_API_URL =
  process.env.NEXT_PUBLIC_SALES_ORDER_API_URL || "http://localhost:5002";

export async function salesOrderApiRequest(
  endpoint: string,
  params: Record<string, string> = {},
  options: RequestInit = {}
): Promise<any> {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("session") : null;
  const sessionId = stored ? JSON.parse(stored).sessionId : null;

  if (!sessionId) {
    throw new Error("No session found");
  }

  const query = new URLSearchParams(params).toString();
  const url = `${SALES_ORDER_API_URL}/${endpoint}${query ? `?${query}` : ""}`;

  const headers = {
    Authorization: `Bearer ${sessionId}`,
    "Content-Type": "application/json",
    "X-Language-Code": "JPN",
    "X-Client-Program": "JP_ORDER",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
    let errorMessage = "Fetch failed";
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export { SALES_ORDER_API_URL };
