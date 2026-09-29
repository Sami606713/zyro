"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearCartState } from "@/lib/store/cart-slice";
import { formatPrice } from "@/lib/format";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Address = {
  id: number;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span>{label}</span>
      <span className="rounded-2xl bg-white/5 p-1">
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-12 w-full rounded-[0.9rem] bg-bg px-4 text-sm text-fg outline-none placeholder:text-muted focus:ring-1 focus:ring-accent"
        />
      </span>
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const auth = useAppSelector((state) => state.auth);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ email: "", first_name: "", last_name: "", phone: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    if (auth.token) {
      api.get<Address[]>("/users/me/addresses", auth.token)
        .then((data) => {
          setAddresses(data);
          if (data.length === 0) {
            setUseNewAddress(true);
          } else {
            const defaultAddr = data.find((a) => a.is_default) || data[0];
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          }
        })
        .catch(() => {
          setUseNewAddress(true);
        })
        .finally(() => setAuthLoaded(true));
    } else {
      setAuthLoaded(true);
    }
  }, [auth.token]);

  if (!authLoaded) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Checkout</h1>
        <p className="mt-4 text-muted">Loading...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Checkout</h1>
        <p className="mt-4 text-muted">
          Your cart is empty.{" "}
          <Link href="/shop" className="text-accent">
            Shop the floor
          </Link>
        </p>
      </div>
    );
  }

  const total = cart.total_amount;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData(event.currentTarget);

      if (isGuest) {
        const orderData = {
          items: cart.items.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
          email: guestInfo.email,
          first_name: guestInfo.first_name,
          last_name: guestInfo.last_name,
          phone: guestInfo.phone,
          shipping_address: {
            address_line1: String(data.get("address") ?? ""),
            city: String(data.get("city") ?? ""),
            state: String(data.get("state") ?? ""),
            postal_code: String(data.get("postal_code") ?? ""),
            country: String(data.get("country") ?? "Pakistan"),
            phone: String(data.get("phone") ?? ""),
          },
          coupon_code: couponCode || undefined,
          notes: notes || undefined,
        };

        const res = await api.post("/orders/guest", orderData);
        dispatch(clearCartState());
        router.push(`/order-confirmation?order_id=${res.id}`);
      } else {
        let addressId = selectedAddressId;

        if (useNewAddress || !selectedAddressId) {
          const newAddress = await api.post<Address>("/users/me/addresses", {
            address_line1: String(data.get("address_line1") ?? ""),
            address_line2: String(data.get("address_line2") ?? "") || null,
            city: String(data.get("city") ?? ""),
            state: String(data.get("state") ?? ""),
            postal_code: String(data.get("postal_code") ?? ""),
            country: String(data.get("country") ?? "Pakistan"),
            phone: String(data.get("phone") ?? ""),
            is_default: addresses.length === 0,
          }, auth.token);
          addressId = newAddress.id;
        }

        const orderData = {
          items: cart.items.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
          shipping_address_id: addressId,
          coupon_code: couponCode || undefined,
          notes: notes || undefined,
        };

        await api.post("/orders", orderData, auth.token);
        await api.delete("/cart", auth.token).catch(() => {});
        dispatch(clearCartState());
        router.push("/order-confirmation");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="lg:grid lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
      onSubmit={handleSubmit}
    >
      <section className="px-4 py-10 md:px-12 lg:py-16">
        <p className="text-sm text-accent">Delivery</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Checkout</h1>
        <p className="mt-3 max-w-[40ch] text-muted">You pay when the shop confirms the size is in stock.</p>

        {isGuest && (
          <div className="mt-6 rounded-xl bg-surface p-4">
            <p className="text-sm text-muted">Checking out as guest. <Link href="/login" className="text-accent">Login</Link> for faster checkout.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" required value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} />
              <Field label="First Name" name="first_name" required value={guestInfo.first_name} onChange={(e) => setGuestInfo({ ...guestInfo, first_name: e.target.value })} />
              <Field label="Last Name" name="last_name" required value={guestInfo.last_name} onChange={(e) => setGuestInfo({ ...guestInfo, last_name: e.target.value })} />
              <Field label="Phone" name="phone" type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} />
            </div>
          </div>
        )}

        {!isGuest && (
          <div className="mt-6">
            <p className="text-sm text-muted">Shipping Address</p>
            {addresses.length === 0 || useNewAddress ? (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Address Line 1" name="address_line1" required />
                <Field label="Address Line 2" name="address_line2" />
                <Field label="City" name="city" required defaultValue="Haripur" />
                <Field label="State" name="state" defaultValue="Khyber Pakhtunkhwa" />
                <Field label="Postal Code" name="postal_code" defaultValue="22000" />
                <Field label="Country" name="country" defaultValue="Pakistan" />
              </div>
            ) : (
              <div className="mt-3 space-y-2" role="radiogroup" aria-label="Shipping address">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      selectedAddressId === addr.id ? "border-accent bg-accent/5" : "border-line hover:border-fg"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address_id"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {addr.address_line1}
                        {addr.is_default && <span className="ml-2 text-xs text-accent">Default</span>}
                      </p>
                      <p className="text-xs text-muted">
                        {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                      </p>
                      {addr.phone && <p className="text-xs text-muted">{addr.phone}</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" required autoComplete="name" />
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
          <div className="sm:col-span-2">
            <Field label="Note" name="note" placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Coupon Code" name="coupon" placeholder="Optional" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
          </div>
        </div>
        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </section>
      <aside className="flex flex-col bg-surface px-4 py-10 md:px-10 lg:sticky lg:top-24 lg:h-[calc(100dvh-6rem)] lg:py-12">
        <h2 className="font-display text-3xl tracking-[-0.03em]">Your order</h2>
        <ul className="mt-6 flex-1 divide-y divide-line overflow-y-auto">
          {cart.items.map((item) => (
            <li key={`${item.variant_id}`} className="flex gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-bg">
                <Image src={item.image_url || ""} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg">{item.product_name}</p>
                <p className="text-sm text-muted">
                  Size {item.size}, qty {item.quantity}
                </p>
              </div>
              <p>{formatPrice(item.total_price)}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-line pt-5">
          <div className="flex items-baseline justify-between">
            <span className="text-muted">Total</span>
            <span className="text-2xl">{formatPrice(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting || (!isGuest && !selectedAddressId && !useNewAddress)}
            className="btn btn-primary mt-5 w-full disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </aside>
    </form>
  );
}
