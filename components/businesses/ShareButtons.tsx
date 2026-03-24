"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Copy, Share2, QrCode } from "lucide-react";

export default function ShareButtons({ slug }: { slug: string }) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setShareUrl(`${origin}/businesses/${slug}`);
  }, [slug]);

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <button
        onClick={() => navigator.clipboard.writeText(shareUrl)}
        style={btn}
        aria-label="Copy link"
      >
        <Copy size={14} /> Copy
      </button>
      <button
        onClick={async () => {
          if (navigator.share) {
            await navigator.share({ url: shareUrl, title: "Check this business" });
          } else {
            await navigator.clipboard.writeText(shareUrl);
          }
        }}
        style={btn}
        aria-label="Share"
      >
        <Share2 size={14} /> Share
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <QrCode size={18} />
        <img src={qr} alt="QR code" style={{ width: 70, height: 70, border: "1px solid var(--border-color)", borderRadius: 10 }} />
      </div>
    </div>
  );
}

const btn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: "var(--radius-full)",
  border: "1px solid var(--border-color)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  cursor: "pointer",
  fontSize: "0.82rem",
};
