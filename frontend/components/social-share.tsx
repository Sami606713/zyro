"use client";

import { Facebook, Twitter, Link2 } from "lucide-react";
import { useState } from "react";

export function SocialShare({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/products/${slug}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-fg hover:border-accent hover:text-accent"
          aria-label={`Share on ${link.name}`}
        >
          <link.icon size={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-fg hover:border-accent hover:text-accent"
        aria-label="Copy link"
      >
        <Link2 size={16} />
      </button>
      {copied && <span className="text-xs text-accent">Copied!</span>}
    </div>
  );
}
