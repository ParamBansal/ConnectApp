// src/redux/themeSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        // You can set your preferred default theme here
        mode: 'dark', 
    },
    reducers: {
        toggleMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        }
    }
});

export const { toggleMode } = themeSlice.actions;
export default themeSlice.reducer;