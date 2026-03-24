"use client";

import { Lightbulb } from "lucide-react";
import { siGithub, siYoutube, type SimpleIcon } from "simple-icons";
import Link from "next/link";

/** Renders a simple-icons SVG data object as an inline <svg> */
function SI({ icon, size = 15 }: { icon: SimpleIcon; size?: number }) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={icon.title}
      dangerouslySetInnerHTML={{ __html: `<path d="${icon.path}"/>` }}
    />
  );
}

export default function Footer() {
  return (
    <footer
      id="main-footer"
      style={{
        borderTop: "1px solid var(--border-color)",
        padding: "48px 24px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 24,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "var(--accent-gradient)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lightbulb size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              C26Hub
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              © 2026 All rights reserved
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <Link
              key={l}
              href={`/${l.toLowerCase()}`}
              style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", transition: "color var(--transition-fast)" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              {l}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { icon: siGithub, href: "https://github.com", label: "GitHub" },
            { icon: siYoutube, href: "https://youtube.com", label: "Youtube" },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36, height: 36, borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-color)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-muted)", transition: "all var(--transition-fast)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--accent-1)";
                el.style.borderColor = "var(--accent-1)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--text-muted)";
                el.style.borderColor = "var(--border-color)";
                el.style.transform = "translateY(0)";
              }}
            >
              <SI icon={icon} size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
