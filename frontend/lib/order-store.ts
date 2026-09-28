import { writeHeld, type HeldPiece } from "@/lib/cart-store";

export type PlacedOrder = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  note: string;
  items: HeldPiece[];
  total: number;
};

const KEY = "zyro-order";

export function saveOrder(order: PlacedOrder) {
  window.localStorage.setItem(KEY, JSON.stringify(order));
  writeHeld([]);
}

export function readOrder(): PlacedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
