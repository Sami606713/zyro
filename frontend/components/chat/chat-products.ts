import type { ChatProduct } from "./chat-product-card";

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as AnyRecord)
    : null;
}

/** Parse a tool result that may be a JSON string, an object, or an array of either. */
function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed || (trimmed[0] !== "{" && trimmed[0] !== "[")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function looksLikeProduct(record: AnyRecord): record is AnyRecord & ChatProduct {
  return typeof record.id === "number" && typeof record.name === "string" && "base_price" in record;
}

/** Walk an unknown payload and collect every product-shaped object it contains. */
function collect(value: unknown, found: ChatProduct[], depth = 0) {
  if (depth > 6 || found.length >= 6) return;

  const parsed = parseMaybeJson(value);

  if (Array.isArray(parsed)) {
    for (const entry of parsed) collect(entry, found, depth + 1);
    return;
  }

  const record = asRecord(parsed);
  if (!record) return;

  if (looksLikeProduct(record)) {
    found.push(record as unknown as ChatProduct);
    return;
  }

  for (const nested of Object.values(record)) {
    if (nested && typeof nested === "object") collect(nested, found, depth + 1);
  }
}

/**
 * Pull renderable products out of the stream's tool call results.
 * Returns one card per unique product slug, preserving tool-call order.
 */
export function extractProducts(toolCalls: unknown[]): ChatProduct[] {
  const products: ChatProduct[] = [];
  const seen = new Set<string>();

  for (const call of toolCalls ?? []) {
    const record = asRecord(call);
    if (!record) continue;

    // Tool results surface under a few different keys depending on SDK version.
    const candidates = [record.result, record.output, record.state, record.content, record];

    for (const candidate of candidates) {
      collect(candidate, products);
    }
  }

  return products.filter((product) => {
    const key = product.slug || String(product.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
