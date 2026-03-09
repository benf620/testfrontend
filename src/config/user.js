// User management with localStorage
// Stores current logged-in user information

const STORAGE_KEY = "connect2grow_current_user";

// Get current user from localStorage or return null
export const getCurrentUser = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      return null;
    }
  }
  return null;
};

// Set current user in localStorage
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Clear current user (logout)
export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Get current user or throw error if not logged in
export const requireCurrentUser = () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user logged in");
  }
  return user;
};

// Helper to determine what type of users to show when swiping
export const getSwipeTargetType = () => {
  const user = getCurrentUser();
  if (!user) return null;
  return user.type === "NWKR" ? "BE" : "NWKR";
};

// For backwards compatibility during transition
export const currentUser = getCurrentUser() || {
  uuid: null,
  id: null,
  type: null
};
