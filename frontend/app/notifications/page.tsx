"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } from "@/lib/store/notification-slice";
import Link from "next/link";
import { useEffect } from "react";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadCount());
    }
  }, [auth.token, dispatch]);

  if (!auth.token) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Notifications</h1>
        <p className="mt-4 text-muted">
          Please <Link href="/login" className="text-accent">login</Link> to view notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Notifications</h1>
        {notifications.unreadCount > 0 && (
          <button
            type="button"
            onClick={() => dispatch(markAllAsRead())}
            className="text-sm text-accent hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>
      <ul className="mt-8 space-y-3">
        {notifications.items.length === 0 ? (
          <li className="py-8 text-center text-muted">No notifications</li>
        ) : (
          notifications.items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => dispatch(markAsRead(n.id))}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  n.is_read ? "border-line bg-surface" : "border-accent/30 bg-accent/5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="mt-1 text-sm text-muted">{n.message}</p>
                  </div>
                  {!n.is_read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  )}
                </div>
                <p className="mt-2 text-xs text-muted">
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
