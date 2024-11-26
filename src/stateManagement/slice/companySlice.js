import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    id: "1234567890",
    image: "",
    billingAddress: "Namaste Chowk, Kshetrapur",
    companyName: "Paradise Cafe",
    companyEmail: "",
    companyPhone: "",
    companyMobile: "9818463366",
  },
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    updateCompanyData: (state, action) => {
      try {
        const {
          image,
          billingAddress,
          companyName,
          companyEmail,
          companyMobile,
        } = action.payload;
        state.data.image = image ? image : "";
        state.data.billingAddress = billingAddress ? billingAddress : "";
        state.data.companyName = companyName ? companyName : "";
        state.data.companyEmail = companyEmail ? companyEmail : "";
        state.data.companyMobile = companyMobile ? companyMobile : "";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const { updateCompanyData } = companySlice.actions;

export const getCompanyData = (state) => state.company.data;

export default companySlice.reducer;
