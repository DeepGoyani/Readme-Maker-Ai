const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  githubCallback: (code: string) => 
    fetchWithAuth('/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  
  getMe: () => fetchWithAuth('/auth/me'),
  
  logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
};

// Repos API
export const reposAPI = {
  getAll: () => fetchWithAuth('/repos'),
  search: (query: string) => fetchWithAuth(`/repos/search?q=${encodeURIComponent(query)}`),
  getDetails: (owner: string, repo: string) => fetchWithAuth(`/repos/${owner}/${repo}`),
};

// Generate API
export const generateAPI = {
  generate: (data: { owner: string; repo: string; template?: string; customInstructions?: string }) =>
    fetchWithAuth('/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  enhance: (content: string, instructions: string) =>
    fetchWithAuth('/generate/enhance', {
      method: 'POST',
      body: JSON.stringify({ content, instructions }),
    }),
};

// Readmes API
export const readmesAPI = {
  getAll: () => fetchWithAuth('/readmes'),
  getById: (id: number) => fetchWithAuth(`/readmes/${id}`),
  update: (id: number, content: string) =>
    fetchWithAuth(`/readmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
  delete: (id: number) => fetchWithAuth(`/readmes/${id}`, { method: 'DELETE' }),
};

// Health Check
export const healthAPI = {
  check: () => fetchWithAuth('/health'),
};
