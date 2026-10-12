// fetch data from api
import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";

let baseURL;


 if (process.env.NODE_ENV !== "production") {
      baseURL = "http://localhost:80/API/";
      // baseURL = "https://erp-backend-j9kg.onrender.com/API/";
  } else {
    baseURL = "https://erp-backend-j9kg.onrender.com/API/"; //link your production-backend if you have any
  }


// withCredentials: true must be inside the config object passed to axios.create().
// It allows the browser to send and receive the httpOnly refresh cookie on
// cross-origin requests.
const API = axios.create({ baseURL, withCredentials: true });

API.interceptors.request.use(
  (req) => {
    const token = getAccessToken();
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

const SKIP_REFRESH_PATHS = ["/users/signin", "/users/refresh"];

let refreshPromise = null;


export const refreshAccessToken = () => {
  if (!refreshPromise) {
    //Notice that this uses axios.post directly instead of API.post.
    //API is the Axios instance with the response interceptor attached. Using it for the refresh request could cause a failed refresh
    //to enter the same interceptor again(which try to send refresh request again). Using plain axios avoids that infinite loop.
    refreshPromise = axios
      .post(`${baseURL}users/refresh`, {}, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.token);
        return res.data.token;
      })
      .finally(() => {
        // Clear the refreshPromise so that future 401s can trigger a new refresh request.
        refreshPromise = null;
      });
  }
  // Return the existing refreshPromise so that concurrent 401s can share it instead of each firing their own refresh request.
  //This means that if multiple API requests fail with 401 at the same time, they will all wait for the same refresh request to complete instead of each sending their own refresh request. 
  // This reduces load on the server and avoids potential race conditions.
  return refreshPromise;
};

//this interceptor handles 401 responses from the server. When a request fails with a 401, it attempts to refresh the access token 
// using the refresh token stored in the httpOnly cookie. If the refresh succeeds, it retries the original request with the new access token. 
// If the refresh fails (e.g., if the refresh token is expired or revoked), it clears the access token and dispatches an event to notify the application that the session has expired.
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    // If the request URL matches one of the paths in SKIP_REFRESH_PATHS, we should skip the refresh logic.
    const shouldSkip = SKIP_REFRESH_PATHS.some((path) => config?.url?.includes(path));
    //If any condition is false, the code skips the refresh logic.
    if (response?.status === 401 && !config._retriedAfterRefresh && !shouldSkip) {
      config._retriedAfterRefresh = true;
      try {
        const newToken = await refreshAccessToken();
        // Update the Authorization header with the new token 
        config.headers.authorization = `Bearer ${newToken}`;
        // Retry the original request with the new token.
        return API(config);
      } catch (refreshError) {
        clearAccessToken();
        // Notify authSlice that the session has expired so Redux can clear the authentication state.
        window.dispatchEvent(new Event("auth:sessionExpired"));
        //This tells the caller that the original API request failed.
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
