"use client";

import type { LucideIcon } from "lucide-react";
import {
  Leaf, Heart, BookOpen, Scale, Globe, Cpu, Zap,
  Music, Camera, Briefcase, Home, Plane,
} from "lucide-react";

const categories: { icon: LucideIcon; label: string; color: string; count: number }[] = [
  { icon: Leaf,     label: "Cat food",        color: "#10b981", count: 48 },
  { icon: Heart,    label: "Food",            color: "#f43f5e", count: 126 },
  { icon: BookOpen, label: "Clothing",        color: "#f59e0b", count: 98 },
  { icon: Scale,    label: "Baby toys",       color: "#6366f1", count: 64 },
  { icon: Globe,    label: "Health",          color: "#06b6d4", count: 87 },
  { icon: Cpu,      label: "Technology",      color: "#8b5cf6", count: 142 },
  { icon: Zap,      label: "Energy",          color: "#f97316", count: 53 },
  { icon: Music,    label: "Arts & Culture",  color: "#ec4899", count: 38 },
  { icon: Camera,   label: "Branding",        color: "#14b8a6", count: 71 },
  { icon: Briefcase,label: "Services",        color: "#84cc16", count: 109 },
  { icon: Home,     label: "Home & Living",   color: "#a78bfa", count: 92 },
  { icon: Plane,    label: "Travel",          color: "#fb923c", count: 55 },
];

export default function CategorySection() {
  return (
    <section
      id="categories"
      style={{
        padding: "80px 24px",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12,
          }}>
            26 <span className="gradient-text">Business Categories</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 440, margin: "0 auto" }}>
            Explore businesses from every corner of human ambition.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
          gap: 16,
        }}>
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <a
                key={i}
                href={`/categories/${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
                id={`category-${i}`}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  padding: "24px 16px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  textDecoration: "none",
                  transition: "all var(--transition-base)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = `0 8px 24px ${cat.color}22`;
                  el.style.borderColor = cat.color + "66";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "var(--border-color)";
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-md)",
                  background: `${cat.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background var(--transition-base)",
                }}>
                  <Icon size={22} color={cat.color} />
                </div>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", textAlign: "center" }}>
                  {cat.label}
                </span>
                <span style={{ fontSize: "0.73rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {cat.count} ideas
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
