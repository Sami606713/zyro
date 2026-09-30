import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart-slice";
import authReducer from "./auth-slice";
import wishlistReducer from "./wishlist-slice";
import notificationReducer from "./notification-slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
