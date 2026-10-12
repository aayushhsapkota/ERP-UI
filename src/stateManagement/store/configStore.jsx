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

// We no longer check token expiry here because the access token is not
// stored in localStorage anymore. Instead, the Axios response interceptor
// in API/index.js handles 401 errors by refreshing the token and retrying
// the failed request automatically.


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
    }),
  devTools: process.env.NODE_ENV !== "production",
});
