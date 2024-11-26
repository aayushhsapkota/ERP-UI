import API from "./index";

export const GetAllExpenseAPI = ({ 
  page, 
  searchBy, 
  filterBy, 
  sortBy, 
  limit, 
  date
   }) =>
  API.get("/expenses", {
    params: {
      page,
      searchBy,
      filterBy,
      sortBy,
      limit,
      date
    },
  });

export const GetExpenseByIdAPI = ({ id, page }) =>
  API.get(`/expenses/${id}`, {
    params: {
      page,
    },
  });

export const CreateExpenseAPI = (AddExpenseData) =>
  API.post("/expenses", AddExpenseData);
// export const createMultipleExpenseAPI = ({ expenses, createdDate }) =>
//   API.post("/expenses/multiple", { expenses, createdDate });

export const UpdateExpenseAPI = (UpdateExpenseData) =>
  API.patch(`/expenses/${UpdateExpenseData._id}`, UpdateExpenseData);
export const DeleteExpenseAPI = (id) => API.delete(`/expenses/${id}`);
export const GetFilterData = () => API.get("/expenses/filter");
