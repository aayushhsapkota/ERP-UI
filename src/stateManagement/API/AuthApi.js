import API from "./index";


export const LoginApi = (loginData) =>
  API.post("/users/signin", loginData);

  
