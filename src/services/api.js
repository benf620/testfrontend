const BASE_URL = "http://localhost:8080";

// API helper functions
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle 204 No Content responses
  if (response.status === 204 || response.status === 201) {
    return null;
  }

  return response.json();
};

// Network Members (NWKR) endpoints
export const nwkrApi = {
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/api/nwkr?id=${id}`);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/api/nwkr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (data) => {
    const response = await fetch(`${BASE_URL}/api/nwkr`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/api/nwkr?id=${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};

// Business Experts endpoints
export const businessExpertApi = {
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/api/business-expert?id=${id}`);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${BASE_URL}/api/business-expert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/api/business-expert?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/api/business-expert?id=${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};

// Likes endpoints
export const likeApi = {
  check: async (likerUuid, likedUuid) => {
    const response = await fetch(
      `${BASE_URL}/api/like?liker=${likerUuid}&liked=${likedUuid}`
    );
    return handleResponse(response);
  },

  create: async (likerUuid, likedUuid) => {
    const response = await fetch(
      `${BASE_URL}/api/like?likerUuid=${likerUuid}&likedUuid=${likedUuid}`,
      { method: "POST" }
    );
    return handleResponse(response);
  },
};
