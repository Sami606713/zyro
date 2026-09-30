"use client";

import { api } from "@/lib/api";
import { useAppSelector } from "@/lib/store/hooks";
import { Star } from "lucide-react";
import { useState } from "react";

export function ReviewForm({ productSlug, onReviewAdded }: { productSlug: string; onReviewAdded: () => void }) {
  const auth = useAppSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!auth.token) {
    return (
      <p className="text-muted">
        Please <a href="/login" className="text-accent">login</a> to leave a review.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post(
        `/products/${productSlug}/reviews`,
        { rating, title, comment },
        auth.token
      );
      setTitle("");
      setComment("");
      setRating(5);
      onReviewAdded();
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <p className="text-sm text-muted">Rating</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`h-8 w-8 ${star <= rating ? "text-accent" : "text-muted"}`}
              aria-label={`${star} stars`}
            >
              <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 h-12 w-full rounded-xl bg-bg px-4 text-sm text-fg outline-none focus:ring-1 focus:ring-accent"
          placeholder="Review title"
        />
      </div>
      <div>
        <label className="text-sm text-muted">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl bg-bg px-4 py-3 text-sm text-fg outline-none focus:ring-1 focus:ring-accent"
          placeholder="Write your review..."
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
