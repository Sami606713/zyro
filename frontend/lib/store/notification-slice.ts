import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
};

type NotificationState = {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
};

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { getState }) => {
    const token = (getState() as any).auth.token;
    return api.get<{ items: Notification[] }>("/notifications", token);
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/unreadCount",
  async (_, { getState }) => {
    const token = (getState() as any).auth.token;
    return api.get<{ count: number }>("/notifications/unread-count", token);
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markRead",
  async (id: number, { getState }) => {
    const token = (getState() as any).auth.token;
    await api.put(`/notifications/${id}/read`, {}, token);
    return id;
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { getState }) => {
    const token = (getState() as any).auth.token;
    await api.put("/notifications/read-all", {}, token);
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const item = state.items.find((n) => n.id === action.payload);
        if (item) item.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.is_read = true));
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
