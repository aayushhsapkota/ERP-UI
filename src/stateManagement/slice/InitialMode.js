import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showNavbar: window.innerWidth > 768 ? true : false,
  darkMode: false,
  initLoading: false,
  escapeOverflow: false,
  openFilter: false,
};

export const initialModeSlice = createSlice({
  name: "initialMode",
  initialState,
  reducers: {
    setToggleNavbar: (state, action) => {
      state.showNavbar = !state.showNavbar;
    },
    setNavbarFalse: (state, action) => {
      state.showNavbar = false;
    },
    setToggleDarkMode: (state, action) => {
      state.darkMode = !state.darkMode;
    },
    setInitLoading: (state, action) => {
      state.initLoading = !state.initLoading;
    },
    setEscapeOverflow: (state, action) => {
      state.escapeOverflow = !state.escapeOverflow;
    },
    setOpenFilter: (state, action) => {
      state.openFilter = !state.openFilter;
    },
  },
});

export const {
  setToggleNavbar,
  setNavbarFalse,
  setToggleDarkMode,
  setInitLoading,
  setEscapeOverflow,
  setOpenFilter,
} = initialModeSlice.actions;

export const getShowNavbar = (state) => state.initialMode.showNavbar;
export const getDarkMode = (state) => state.initialMode.darkMode;
export const getInitLoading = (state) => state.initialMode.initLoading;
export const getEscapeOverflow = (state) => state.initialMode.escapeOverflow;
export const getOpenFilter = (state) => state.initialMode.openFilter;

export default initialModeSlice.reducer;
