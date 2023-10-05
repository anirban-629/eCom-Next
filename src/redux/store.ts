import { configureStore } from "@reduxjs/toolkit";
import shoppingReducer from "./shoppingSlice";

export const store = configureStore({
  reducer: {
    shopping: shoppingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
