"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "@/lib/store/wishlist-slice";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function WishlistButton({ productId, className = "" }: { productId: number; className?: string }) {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist);
  const auth = useAppSelector((state) => state.auth);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchWishlist());
    }
  }, [auth.token, dispatch]);

  useEffect(() => {
    setIsWishlisted(wishlist.items.some((item) => item.product_id === productId));
  }, [wishlist.items, productId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.token) return;
    if (isWishlisted) {
      await dispatch(removeFromWishlist(productId));
    } else {
      await dispatch(addToWishlist(productId));
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
        isWishlisted
          ? "border-accent bg-accent text-ink"
          : "border-white/20 text-fg hover:border-fg"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
    </button>
  );
}
