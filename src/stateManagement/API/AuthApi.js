import API from "./index";


export const LoginApi = (loginData) =>
  API.post("/users/signin", loginData);

//Exchanges the httpOnly refresh cookie for a new access token, rotating the
// refresh token in the same call.

//returns access token in the response body and also a new refresh token in the httpOnly cookie. 
export const RefreshApi = () => API.post("/users/refresh");

export const LogoutApi = () => API.post("/users/logout");

