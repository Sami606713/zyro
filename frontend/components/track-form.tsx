"use client";

import { useState } from "react";

export function TrackForm() {
  const [code, setCode] = useState("");
  const [asked, setAsked] = useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setAsked(true);
      }}
    >
      <label className="grid gap-2 text-sm text-fg">
        Order name
        <input
          required
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="h-11 border border-line bg-surface px-3 text-fg outline-none"
          placeholder="The name you ordered under"
        />
      </label>
      <button type="submit" className="btn btn-primary w-fit">
        Check
      </button>
      {asked ? (
        <p className="text-fg">
          Orders are confirmed by the shop, not by a courier tracker on this site. Send “{code}” to
          @zyrostore1 and they will tell you where it is.
        </p>
      ) : null}
    </form>
  );
}
