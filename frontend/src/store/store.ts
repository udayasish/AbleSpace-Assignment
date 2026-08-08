import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import tasksSlice from "./tasksSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      tasks: tasksSlice,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
