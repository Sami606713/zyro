type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  console.log("[Analytics]", eventName, params || "");
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

export function trackProductView(productId: number, productName: string, price: number) {
  trackEvent("view_item", {
    item_id: productId,
    item_name: productName,
    price: price,
    currency: "PKR",
  });
}

export function trackAddToCart(productId: number, productName: string, price: number, quantity: number) {
  trackEvent("add_to_cart", {
    item_id: productId,
    item_name: productName,
    price: price,
    quantity: quantity,
    currency: "PKR",
  });
}

export function trackBeginCheckout(total: number, itemCount: number) {
  trackEvent("begin_checkout", {
    value: total,
    currency: "PKR",
    item_count: itemCount,
  });
}

export function trackPurchase(orderId: number, total: number, itemCount: number) {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: total,
    currency: "PKR",
    item_count: itemCount,
  });
}

export function trackSearch(searchTerm: string) {
  trackEvent("search", { search_term: searchTerm });
}

export function trackWishlistAdd(productId: number, productName: string) {
  trackEvent("add_to_wishlist", {
    item_id: productId,
    item_name: productName,
  });
}
