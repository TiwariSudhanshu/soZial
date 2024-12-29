import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "userState",
    initialState: {
        userPost: [],
        darkMode: false, 
    },
    reducers: {
        addPost: (state, action) => {
            state.userPost.push(action.payload);
        },
        setPosts: (state, action) => {
            state.userPost = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
    },
});

export const { addPost, setPosts, toggleDarkMode } = userSlice.actions;

export default userSlice.reducer;
