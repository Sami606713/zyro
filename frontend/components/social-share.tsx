"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
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
