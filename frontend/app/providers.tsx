"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { loadFromStorage } from "@/lib/store/auth-slice";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
