import * as api from "../API/ExpenseApi";
import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { NotifyWarning } from "../../toastify";
import { toast } from "react-toastify";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
const Status = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  FAILED: "failed",
});
const initialState = {
  openExpenseSelector: false,
  selectedExpense: null,
  status: Status.IDLE,
  data: [],
  details: null,
  page: 1,
  filterBy: "",
  sortBy: 1,
  searchBy: {
    name: "",
    anything: "",
  },
  date: {
    startDate: "",
    endDate: todayNepaliDate(new Date()),
  },
  pageCount: 1,
  newForm: {
    id: nanoid(),
   
    title: "",
   
    image: "",
    category: "",
    amount: "",
    remarks: "",
    
  },
  editedID: null,
  deletedID: null,
  
};

export const getAllExpenses =
  ({ page, searchBy, filterBy, sortBy, limit, date }) =>
  async (dispatch) => {
    dispatch(setExpenseStatus(Status.LOADING));
    try {
      const {
        data: { data, pageCount },
      } = await api.GetAllExpenseAPI({
        page,
        searchBy,
        filterBy,
        sortBy,
        limit,
        date
      });
      dispatch(setExpensePageCount(pageCount));
      dispatch(setAllExpenses(data));
      return dispatch(setExpenseStatus(Status.IDLE));
    } catch (error) {
      NotifyWarning(
        error?.response?.data?.message || "Error please reload page"
      );
      return dispatch(setExpenseStatus(Status.FAILED));
    }
  };

export const getExpenseById = (id) => async (dispatch) => {
  dispatch(setExpenseStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.GetExpenseByIdAPI(id);
    dispatch(setExpenseById(data));
    return dispatch(setExpenseStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setExpenseStatus(Status.FAILED));
  }
};

export const createExpense = (AddExpenseData) => async (dispatch) => {
  dispatch(setExpenseStatus(Status.LOADING));
  try {
    const {
      data: { data, message },
    } = await api.CreateExpenseAPI(AddExpenseData);

    toast.success(message, {
      position: "bottom-center",
      autoClose: 2000,
    });
    dispatch(addNewExpense(data));
    return dispatch(setExpenseStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setExpenseStatus(Status.FAILED));
  }
};

export const updateExpense = (UpdateExpenseData) => async (dispatch) => {
  dispatch(setExpenseStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.UpdateExpenseAPI(UpdateExpenseData);
    dispatch(onConfirmEditExpense(data));
    return dispatch(setExpenseStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setExpenseStatus(Status.FAILED));
  }
};

export const deleteExpense = (id) => async (dispatch) => {
  dispatch(setExpenseStatus(Status.LOADING));
  try {
    await api.DeleteExpenseAPI(id);
    dispatch(onConfirmDeletedExpense());
    return dispatch(setExpenseStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setExpenseStatus(Status.FAILED));
  }
};

export const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenseStatus: (state, action) => {
      state.status = action.payload;
    },
    setExpensePageCount: (state, action) => {
      state.pageCount = action.payload;
    },
    setExpenseSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    setExpenseFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setExpenseSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setExpensePageNumber: (state, action) => {
      state.page = action.payload;
    },
    setExpenseById: (state, action) => {
      state.details = action.payload;
    },
    addNewExpense: (state, action) => {
      const newDatas = [...state.data, action.payload];
      state.data = newDatas;

      const reNewForm = {
        title: "",
        image: "",
        category: "",
        amount: "",
        remarks: "",
      };
      state.newForm = { ...reNewForm };
    },
   
    updateNewExpenseForm: (state, action) => {
      state.newForm = { ...action.payload };
    },

    updateNewExpenseFormField: (state, action) => {
      state.newForm[action.payload.key] = action.payload.value;
    },

    setAllExpenses: (state, action) => {
      state.data = action.payload;
    },

    setDeleteId: (state, action) => {
      state.deletedID = action.payload;
    },

    setEditedId: (state, action) => {
      state.editedID = action.payload;
    },

    onConfirmDeletedExpense: (state) => {
      const newDatas = state.data.filter(
        (expense) => expense._id !== state.deletedID
      );
      state.data = newDatas;
      state.deletedID = null;
    },

    onConfirmEditExpense: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (expense) => expense._id === state.editedID
      );
      if (isFindIndex !== -1) {
        state.data[isFindIndex] = { ...action.payload };
      }
      state.editedID = null;
    },

    onAddOrRemoveExpense: (state, action) => {
      const { expenses, type } = action.payload;
      const newDatas = [...state.data];
      expenses.forEach((expense) => {
        const isFindIndex = newDatas.findIndex(
          (data) => data._id === expense.expenseID
        );
        if (isFindIndex !== -1) {
          if (type === "Sale") {
            if (expense.isSecondaryUnitChecked) {
              newDatas[isFindIndex].quantity -=
              expense.quantity / expense.conversionRatio;
            } else {
              newDatas[isFindIndex].quantity -= parseInt(expense.quantity);
            }
          } else {
            if (expense.isSecondaryUnitChecked) {
              newDatas[isFindIndex].quantity +=
              expense.quantity / expense.conversionRatio;
            } else {
              newDatas[isFindIndex].quantity += parseInt(expense.quantity);
            }
          }
        }
      });
      state.data = newDatas;
    },

   
    setOpenExpenseSelector: (state, action) => {
      state.openExpenseSelector = action.payload;
      if (!action.payload) {
        state.selectedExpense = null;
      }
    },

    setExpenseSelector: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (expense) => expense._id === action.payload
      );
      if (isFindIndex !== -1) {
        state.selectedExpense = state.data[isFindIndex];
      }
    },
    setExpenseDateFilterOpen: (state, action) => {
      state.dateFilterOpen = action.payload;
    },
    setExpenseDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const {
  setExpensePageCount,
  setExpensePageNumber,
  setExpenseSearchBy,
  setExpenseFilterBy,
  setExpenseDateFilterOpen,
  setExpenseSortBy,
  addNewExpense,
  setExpenseById,
  onAddOrRemoveExpense,
  updateNewExpenseForm,
  updateNewExpenseFormField,
  setAllExpenses,
  setDeleteId,
  setEditedId,
  onConfirmDeletedExpense,
  onConfirmEditExpense,
  setOpenExpenseSelector,
  setExpenseSelector,
  setExpenseStatus,
  setExpenseDate
} = expenseSlice.actions;


export const getAllExpenseSelector = (state) => state.expenses.data;
export const getExpensePageCountSelector = (state) => state.expenses.pageCount;
export const getExpensePageNumberSelector = (state) => state.expenses.page;
export const getExpenseSearchBySelector = (state) => state.expenses.searchBy;
export const getExpenseFilterBySelector = (state) => state.expenses.filterBy;
export const getExpenseDateFilterOpenSelector = (state) =>
  state.expenses.dateFilterOpen;
export const getExpenseDateSelector = (state) => state.expenses.date;


export const getExpenseSortBySelector = (state) => state.expenses.sortBy;
export const getExpenseByIdSelector = (state) => state.expenses.details;
export const getExpenseNewForm = (state) => state.expenses.newForm;
export const getDeletedExpenseForm = (state) => state.expenses.deletedID;
export const getEditedIdForm = (state) => state.expenses.editedID;
export const getIsOpenExpenseSelector = (state) =>
  state.expenses.openExpenseSelector;

export const getSelectedExpense = (state) => state.expenses.selectedExpense;
export const getExpenseStatus = (state) => state.expenses.status;
export default expenseSlice.reducer;

