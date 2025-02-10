import { createSlice } from "@reduxjs/toolkit";

const isLoggedIn = !!localStorage.getItem("authToken");
const storedRole = localStorage.getItem("userRole");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: isLoggedIn,
    token: localStorage.getItem("authToken"),
    role: storedRole
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("userRole", action.payload.role);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
