"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } from "@/lib/store/notification-slice";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function NotificationBell() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);
  const auth = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadCount());
    }
  }, [auth.token, dispatch]);

  if (!auth.token) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-fg hover:border-fg"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {notifications.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-ink">
            {notifications.unreadCount > 9 ? "9+" : notifications.unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-line bg-bg p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">Notifications</h3>
            {notifications.unreadCount > 0 && (
              <button
                type="button"
                onClick={() => dispatch(markAllAsRead())}
                className="text-xs text-accent hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {notifications.items.length === 0 ? (
              <li className="py-4 text-center text-sm text-muted">No notifications</li>
            ) : (
              notifications.items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => dispatch(markAsRead(n.id))}
                    className={`w-full rounded-xl p-3 text-left text-sm transition-colors ${
                      n.is_read ? "bg-surface" : "bg-accent/10"
                    }`}
                  >
                    <p className="font-medium">{n.title}</p>
                    <p className="mt-1 text-muted">{n.message}</p>
                  </button>
                </li>
              ))
            )}
          </ul>
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="mt-3 block text-center text-sm text-accent hover:underline"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
