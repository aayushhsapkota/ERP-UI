import API from "./index";


export const LoginApi = (loginData) =>
  API.post("/users/signin", loginData);


export const LogoutApi = () => API.post("/users/logout");

