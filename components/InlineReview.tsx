"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RESTAURANT } from "@/config/restaurant";

export default function InlineReview() {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitReview() {
    if (!rating || loading) return;

    try {
      setLoading(true);

      const { error } = await supabase.from("reviews").insert({
        restaurant_id: "aagraha", // ✅ FIXED
        rating,
        feedback: feedback.trim() || null,
      });

      if (error) {
        console.error("Review insert error:", error);
        alert("Could not submit feedback. Please try again.");
        return;
      }

      /* 🚨 WhatsApp alert ONLY for 1⭐ & 2⭐ */
      if (rating === 1 || rating === 2) {
        const message = encodeURIComponent(
          `⚠️ Low rating received at ${RESTAURANT.name}\n\n` +
          `Rating: ${rating} star(s)\n` +
          `Feedback: ${feedback || "No comment provided"}`
        );

        window.open(
          `https://wa.me/${RESTAURANT.whatsapp}?text=${message}`,
          "_blank"
        );
      }

      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- AFTER SUBMIT ---------- */

  if (submitted && rating === 5) {
    return (
      <section className="mt-16 px-6 text-center">
        <h3 className="text-[22px] mb-3 text-[#F5E6C8]">
          Thank you! 🙏
        </h3>

        <p className="text-sm mb-5 text-[#AFA99E]">
          We’re glad you enjoyed your visit.
          <br />
          If you’d like, you can also share your experience on Google.
        </p>

        <a
          href={RESTAURANT.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-[#f6d28b] px-6 py-3 text-black font-medium"
        >
          ⭐ Leave a Google Review
        </a>
      </section>
    );
  }

  if (submitted && rating < 5) {
    return (
      <section className="mt-16 px-6 text-center">
        <h3 className="text-[22px] mb-3 text-[#F5E6C8]">
          Thank you for your feedback 🙏
        </h3>

        <p className="text-sm text-[#AFA99E]">
          We truly appreciate you taking the time to help us improve.
        </p>
      </section>
    );
  }

  /* ---------- REVIEW FORM ---------- */

  return (
    <section className="mt-16 px-6 text-center max-w-md mx-auto">
      <h3 className="text-[22px] mb-2 text-[#F5E6C8]">
        How was your experience today?
      </h3>

      <p className="text-sm mb-4 text-[#AFA99E]">
        Your feedback helps us serve you better.
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            aria-label={`${n} star rating`}
            className={`text-3xl transition ${
              rating && rating >= n
                ? "text-yellow-400"
                : "text-gray-600"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Tell us more (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full rounded-lg bg-black border border-gray-700 p-3 text-sm text-white"
        rows={3}
      />

      <button
        onClick={submitReview}
        disabled={loading || !rating}
        className={`mt-4 w-full rounded-xl py-3 font-medium transition ${
          loading || !rating
            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
            : "bg-[#7a1f1f] text-white"
        }`}
      >
        {loading ? "Submitting..." : "Submit feedback"}
      </button>
    </section>
  );
}
