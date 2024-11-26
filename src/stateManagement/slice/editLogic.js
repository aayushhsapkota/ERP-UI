import { createSlice } from "@reduxjs/toolkit";

const EditSlice = createSlice({
    name: "editLogic",
    initialState: {
        editMode: false,
        clientIsChoosed: false,
    },
    reducers: {
        setEditMode(state, action) {
            state.editMode = action.payload;
        },
        setClientIsChoosed(state, action) {
            state.clientIsChoosed = action.payload
        }   
    }
});

export const {setEditMode, setClientIsChoosed} = EditSlice.actions;

export const getEditMode = (state) => state.editLogic.editMode;
export const getClientIsChoosed = (state) => state.editLogic.clientIsChoosed;

export default EditSlice.reducer;