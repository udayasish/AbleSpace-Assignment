import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
