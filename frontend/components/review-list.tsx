"use client";

import { fetchProductReviews } from "@/lib/storefront-api";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  user?: { id: number; first_name: string; last_name: string };
};

export function ReviewList({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductReviews(productSlug)
      .then((data) => setReviews(data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productSlug]);

  if (loading) return <p className="text-muted">Loading reviews...</p>;

  if (reviews.length === 0) {
    return <p className="text-muted">No reviews yet. Be the first to review!</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-xl bg-surface p-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= review.rating ? "text-accent" : "text-muted"}
                  fill={star <= review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {review.user?.first_name} {review.user?.last_name}
            </span>
          </div>
          {review.title && <p className="mt-2 font-medium">{review.title}</p>}
          {review.comment && <p className="mt-1 text-sm text-muted">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
