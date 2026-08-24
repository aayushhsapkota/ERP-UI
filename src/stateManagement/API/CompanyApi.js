import API from "./index";

export const GetCompanyAPI = () => API.get("/company");
export const UpdateCompanyAPI = (CompanyData) => API.patch("/company", CompanyData);
