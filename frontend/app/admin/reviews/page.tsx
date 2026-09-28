"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
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
  user: { first_name: string; last_name: string; email: string };
  product: { name: string };
};

export default function AdminReviewsPage() {
  const { token } = useAdminAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<Review[]>("/admin/reviews", token)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/reviews/${id}`, token);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading reviews...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Reviews</h1>
      <p className="mt-1 text-sm text-muted">Moderate customer reviews. Delete inappropriate content.</p>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="py-20 text-center text-muted">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-white/5 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{review.user?.first_name} {review.user?.last_name}</p>
                  <p className="text-sm text-muted">on {review.product?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-accent text-accent" : "text-muted"}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-6 text-muted">{review.comment}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString()}</p>
                <button
                  onClick={() => deleteReview(review.id)}
                  disabled={deleting === review.id}
                  className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                >
                  {deleting === review.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
