import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../slice/productSlice";
import clientReducer from "../slice/clientSlice";
import invoiceReducer from "../slice/invoiceSlice";
import InitialMode from "../slice/InitialMode";
import companySlice from "../slice/companySlice";
import transactionSlice from "../slice/transactionSlice";
import paymentSlice from "../slice/paymentSlice";
import expenseReducer from "../slice/expenseSlice";
import editLogicReducer from "../slice/editLogic";
import authReducer from "../slice/authSlice";
import { logout } from "../slice/authSlice";
import jwt_decode from "jwt-decode";

function isTokenExpired(token) {
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now().valueOf() / 1000;

  return decodedToken.exp < currentTime;
}

const checkTokenExpirationMiddleware = storeAPI => next => action => {
  const token = localStorage.getItem('erp-token');
  
  if (token && isTokenExpired(token)) {
    storeAPI.dispatch(logout());
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    products: productReducer,
    clients: clientReducer,
    invoices: invoiceReducer,
    payments: paymentSlice,
    transactions: transactionSlice,
    company: companySlice,
    initialMode: InitialMode,
    expenses: expenseReducer,
    editLogic: editLogicReducer,
    auth: authReducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(checkTokenExpirationMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});
