// fetch data from api
import axios from "axios";
let baseURL;


 if (process.env.NODE_ENV !== "production") {
      baseURL = "http://localhost:4000/API/"; 
  } else {
    baseURL = "http://localhost:4000/API/"; //link your production-backend if you have any
  }


const API = axios.create({ baseURL }, { withCredentials: true });
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("erp-token");
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);
export default API;
