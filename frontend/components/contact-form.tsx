"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="text-fg">
        Noted. The shop replies on Instagram at @zyrostore1. This form does not send email yet.
      </p>
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label className="grid gap-2 text-sm text-fg">
        Name
        <input required name="name" className="h-11 border border-line bg-surface px-3 text-fg outline-none" />
      </label>
      <label className="grid gap-2 text-sm text-fg">
        Email
        <input required type="email" name="email" className="h-11 border border-line bg-surface px-3 text-fg outline-none" />
      </label>
      <label className="grid gap-2 text-sm text-fg">
        Message
        <textarea required name="message" rows={5} className="border border-line bg-surface px-3 py-3 text-fg outline-none" />
      </label>
      <button type="submit" className="btn btn-primary w-fit">
        Send
      </button>
    </form>
  );
}
