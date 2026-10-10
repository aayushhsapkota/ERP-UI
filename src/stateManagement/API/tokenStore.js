// Stores the current access token in memory only, not in localStorage or
// sessionStorage, making it harder for an XSS attack to steal it from storage.
// An attacker could still access the token while it is in memory, but only
// while the tab is open and until the token is replaced.

// After a page reload, authentication is restored using the httpOnly refresh
// cookie instead (see bootstrapAuth in authSlice.js).
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};
