// Hardcoded user configuration for development
// TODO: Replace with proper authentication system

export const currentUser = {
  uuid: "NWKR-1", // Current logged-in user UUID
  id: 1,
  type: "NWKR" // or "BE"
};

// Helper to determine what type of users to show when swiping
export const getSwipeTargetType = () => {
  return currentUser.type === "NWKR" ? "BE" : "NWKR";
};
