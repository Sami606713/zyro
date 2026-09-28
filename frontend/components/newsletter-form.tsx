"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        setDone(true);
      }}
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-3 border-b border-line">
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setDone(false);
          }}
          placeholder="Your email address"
          className="h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
        />
        <button type="submit" aria-label="Subscribe" className="text-fg hover:text-accent">
          <ArrowRight size={18} />
        </button>
      </div>
      {done ? (
        <p className="mt-3 text-sm text-fg">Noted. The shop will use this list when mailings start.</p>
      ) : null}
    </form>
  );
}
