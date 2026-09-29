import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type WishlistItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  base_price: number;
  image_url: string | null;
};

type WishlistState = {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
};

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState }) => {
    const token = (getState() as any).auth.token;
    return api.get<WishlistItem[]>("/wishlist", token);
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (product_id: number, { getState }) => {
    const token = (getState() as any).auth.token;
    await api.post(`/wishlist/${product_id}`, {}, token);
    return product_id;
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (product_id: number, { getState }) => {
    const token = (getState() as any).auth.token;
    await api.delete(`/wishlist/${product_id}`, token);
    return product_id;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.product_id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
