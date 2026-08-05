export function createLovableAuth() {
  return {
    signInWithOAuth: async () => ({ error: new Error("OAuth not configured in static mode") }),
  };
}
