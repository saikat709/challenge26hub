"use client";

import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";

type Business = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
};

export default function BrandImagesClient() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/businesses");
      const json = await res.json();
      setBusinesses(json.businesses ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(99,102,241,0.12)", color: "var(--accent-1)", fontWeight: 700 }}>
          <ImageIcon size={14} /> Brand Gallery
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", marginTop: 10 }}>
          Logos and Covers
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Everyone can view names and logos. Uploads require sign-in.</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
          <Loader2 size={18} className="spin" /> Loading brand images…
        </div>
      ) : (
        <>
          <section style={{ marginBottom: 28 }}>
            <h3 style={{ marginBottom: 12 }}>Logos</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {businesses.map((biz) => (
                <div key={`${biz.id}-logo`} style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 10, textAlign: "center", background: "var(--bg-card)" }}>
                  {biz.logoUrl ? (
                    <img src={biz.logoUrl} alt={`${biz.name} logo`} style={{ width: "100%", height: 96, objectFit: "contain" }} />
                  ) : (
                    <div style={{ width: "100%", height: 96, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                      No logo
                    </div>
                  )}
                  <div style={{ marginTop: 8, color: "var(--text-secondary)", fontSize: "0.85rem" }}>{biz.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ marginBottom: 12 }}>Cover photos</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {businesses.map((biz) => (
                <div key={`${biz.id}-cover`} style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 10, background: "var(--bg-card)" }}>
                  {biz.coverUrl ? (
                    <img src={biz.coverUrl} alt={`${biz.name} cover`} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10 }} />
                  ) : (
                    <div style={{ width: "100%", height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                      No cover yet
                    </div>
                  )}
                  <div style={{ marginTop: 8, color: "var(--text-secondary)", fontSize: "0.85rem" }}>{biz.name}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
