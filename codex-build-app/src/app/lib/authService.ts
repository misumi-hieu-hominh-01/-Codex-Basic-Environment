const API_BASE_URL = 'http://localhost:5002';
const HISTORY_APP_ID = 'history-app';

export async function login(loginId: string, password: string) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login?applicationId=${HISTORY_APP_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId, password }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Login failed');
  }

  return response.json() as Promise<{ sessionId: string }>;
}
