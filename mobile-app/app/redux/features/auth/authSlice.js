import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      AsyncStorage.setItem("expirationTime", expirationTime.toString());
    },
    logout: (state) => {
      state.userInfo = null;
      AsyncStorage.clear();
    },
    loadUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setCredentials, logout, loadUserInfo } = authSlice.actions;

export const initializeAuth = () => async (dispatch) => {
  const userInfo = await AsyncStorage.getItem("userInfo");
  if (userInfo) {
    dispatch(loadUserInfo(JSON.parse(userInfo)));
  }
};

export default authSlice.reducer;
