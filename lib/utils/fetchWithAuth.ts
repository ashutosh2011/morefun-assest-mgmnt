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
      // Try to get the error message from the response body
      const errorData = await response.json().catch(() => null);
      
      if (response.status === 401) {
        throw new Error(errorData?.message || 'Unauthorized');
      }

      // If we have an error message from the backend, use it
      if (errorData?.message) {
        throw new Error(errorData.message);
      } else if (errorData?.error) {
        throw new Error(errorData.error);
      }
      
      // Fallback to generic error if no specific message
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Fetch error:', error.message);
    } else {
      console.log('Fetch error: Cannot parse error message');
    }
    throw error;
  }
}


