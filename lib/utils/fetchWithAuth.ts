
'use client';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Ensure headers object exists
  const headers = new Headers(options.headers || {});
  
  // Get auth token from cookie on client side
  const token = localStorage.getItem('token');
  // Add authorization header with bearer token if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Merge headers back into options
  options.headers = headers;

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle unauthorized or other error responses
      if (response.status === 401) {
        // Handle unauthorized - could redirect to login
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}


