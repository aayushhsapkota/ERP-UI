import { createSlice } from "@reduxjs/toolkit";
import * as api from "../API/CompanyApi";
import { NotifySuccess, NotifyWarning } from "../../toastify";

const Status = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  FAILED: "failed",
});

const initialState = {
  status: Status.IDLE,
  data: {
    id: "",
    billingAddress: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyMobile: "",
  },
};

export const fetchCompanyData = () => async (dispatch) => {
  dispatch(setCompanyStatus(Status.LOADING));
  try {
    const {
      data: { data },
    } = await api.GetCompanyAPI();
    dispatch(setCompanyData(data));
    return dispatch(setCompanyStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setCompanyStatus(Status.FAILED));
  }
};

export const updateCompanyData = (CompanyData) => async (dispatch) => {
  dispatch(setCompanyStatus(Status.LOADING));
  try {
    const {
      data: { data, message },
    } = await api.UpdateCompanyAPI(CompanyData);
    NotifySuccess(message);
    dispatch(setCompanyData(data));
    return dispatch(setCompanyStatus(Status.IDLE));
  } catch (error) {
    NotifyWarning(error?.response?.data?.message || "Error please reload page");
    return dispatch(setCompanyStatus(Status.FAILED));
  }
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyStatus: (state, action) => {
      state.status = action.payload;
    },
    setCompanyData: (state, action) => {
      const {
        _id,
        billingAddress,
        companyName,
        companyEmail,
        companyPhone,
        companyMobile,
      } = action.payload || {};
      state.data.id = _id || "";
      state.data.billingAddress = billingAddress || "";
      state.data.companyName = companyName || "";
      state.data.companyEmail = companyEmail || "";
      state.data.companyPhone = companyPhone || "";
      state.data.companyMobile = companyMobile || "";
    },
  },
});

export const { setCompanyStatus, setCompanyData } = companySlice.actions;

export const getCompanyData = (state) => state.company.data;

export const getCompanyStatus = (state) => state.company.status;

export default companySlice.reducer;
