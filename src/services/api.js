const BASE_URL = "http://localhost:8080";

// API helper functions
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  // Try to get response text
  const text = await response.text();

  // If there's no content, return null
  if (!text) {
    return null;
  }

  // Try to parse as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn('Failed to parse response as JSON:', text);
    return null;
  }
};

// Network Members (NWKR) endpoints
export const nwkrApi = {
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/api/nwkr?id=${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/api/nwkr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (data) => {
    const response = await fetch(`${BASE_URL}/api/nwkr`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/api/nwkr?id=${id}`, {
      method: "DELETE",
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Business Experts endpoints
export const businessExpertApi = {
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/api/business-expert?id=${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/api/business-expert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/business-expert?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/api/business-expert?id=${id}`, {
      method: "DELETE",
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Likes endpoints
export const likeApi = {
  check: async (likerUuid, likedUuid) => {
    const response = await fetch(
      `${BASE_URL}/api/like?liker=${likerUuid}&liked=${likedUuid}`,
      { credentials: 'include' }
    );
    return handleResponse(response);
  },

  create: async (likerUuid, likedUuid) => {
    const response = await fetch(
      `${BASE_URL}/api/like?likerUuid=${likerUuid}&likedUuid=${likedUuid}`,
      {
        method: "POST",
        credentials: 'include'
      }
    );
    return handleResponse(response);
  },
};

// Matches endpoints
export const matchApi = {
  getMatches: async (uuid) => {
    const response = await fetch(`${BASE_URL}/api/matches?uuid=${uuid}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Feed endpoints
export const feedApi = {
  getFeed: async (uuid, limit = 10) => {
    const response = await fetch(`${BASE_URL}/api/feed?uuid=${uuid}&limit=${limit}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },
};
