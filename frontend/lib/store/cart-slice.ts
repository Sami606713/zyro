import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type CartItem = {
  id: number;
  variant_id: number;
  quantity: number;
  product_name: string;
  product_slug: string;
  size: string;
  color: string;
  sku: string;
  unit_price: number;
  total_price: number;
  image_url: string | null;
};

type CartState = {
  items: CartItem[];
  total_amount: number;
  total_items: number;
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  items: [],
  total_amount: 0,
  total_items: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const token = (getState() as any).auth.token;
    const data = await api.get<{ id: number; items: CartItem[]; total_amount: number; total_items: number }>(
      "/cart",
      token
    );
    return data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { variant_id, quantity }: { variant_id: number; quantity: number },
    { getState }
  ) => {
    const token = (getState() as any).auth.token || localStorage.getItem("zyro-token");
    const data = await api.post<CartState>("/cart/items", { variant_id, quantity }, token);
    return data;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { item_id, quantity }: { item_id: number; quantity: number },
    { getState }
  ) => {
    const token = (getState() as any).auth.token;
    const data = await api.put<CartState>(`/cart/items/${item_id}`, { quantity }, token);
    return data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (item_id: number, { getState }) => {
    const token = (getState() as any).auth.token;
    await api.delete(`/cart/items/${item_id}`, token);
    return item_id;
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { getState }) => {
    const token = (getState() as any).auth.token;
    await api.delete("/cart", token);
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState(state) {
      state.items = [];
      state.total_amount = 0;
      state.total_items = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total_amount = action.payload.total_amount;
        state.total_items = action.payload.total_items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_amount = action.payload.total_amount;
        state.total_items = action.payload.total_items;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_amount = action.payload.total_amount;
        state.total_items = action.payload.total_items;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total_items = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total_amount = state.items.reduce((sum, item) => sum + item.total_price, 0);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total_amount = 0;
        state.total_items = 0;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
