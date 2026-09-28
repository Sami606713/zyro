export type HeldPiece = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

const KEY = "zyro-cart";

export function readHeld(): HeldPiece[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HeldPiece[]) : [];
  } catch {
    return [];
  }
}

export function cartCount(items: HeldPiece[] = readHeld()) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function writeHeld(items: HeldPiece[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("zyro-cart"));
}

export function holdPiece(piece: Omit<HeldPiece, "qty">) {
  const items = readHeld();
  const existing = items.find((item) => item.slug === piece.slug && item.size === piece.size);
  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ ...piece, qty: 1 });
  }
  writeHeld(items);
  return items;
}
