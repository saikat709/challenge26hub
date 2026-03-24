"use client";

import { Heart, MessageCircle, Star, ArrowUpRight, Flame } from "lucide-react";
import { useState } from "react";

const businesses = [
  {
    id: 1,
    title: "Cats & Co. Gourmet",
    description:
      "Premium cat food brand delivering chef-designed recipes with sustainable packaging and doorstep delivery.",
    category: "Cat food",
    categoryColor: "#10b981",
    votes: 342,
    comments: 57,
    owner: "Aisha Rahman",
    ownerInitials: "AR",
    avatarColor: "#6366f1",
    tags: ["D2C", "Pet", "Food"],
    hot: true,
  },
  {
    id: 2,
    title: "Playful Sprouts",
    description:
      "Eco-friendly baby toys brand with modular wooden kits and monthly craft drops for parents and kids.",
    category: "Baby toys",
    categoryColor: "#f59e0b",
    votes: 289,
    comments: 44,
    owner: "Marcus Chen",
    ownerInitials: "MC",
    avatarColor: "#8b5cf6",
    tags: ["Toys", "Eco", "Kids"],
    hot: false,
  },
  {
    id: 3,
    title: "Bloom Streetwear Lab",
    description:
      "On-demand clothing studio with AI-assisted patterns, recycled fabrics, and creator-led capsule drops.",
    category: "Clothing",
    categoryColor: "#06b6d4",
    votes: 211,
    comments: 38,
    owner: "Priya Nair",
    ownerInitials: "PN",
    avatarColor: "#06b6d4",
    tags: ["Fashion", "Circular", "On-demand"],
    hot: false,
  },
];

function BusinessCard({ business }: { business: (typeof businesses)[0] }) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(business.votes);

  return (
    <article
      id={`business-card-${business.id}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: "pointer",
        transition: "all var(--transition-base)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-hover)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-color)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Gradient accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "var(--accent-gradient)",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            padding: "4px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: `${business.categoryColor}18`,
            color: business.categoryColor,
          }}>
            {business.category}
          </span>
          {business.hot && (
            <span style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: "var(--radius-full)",
              fontSize: "0.72rem", fontWeight: 600,
              background: "rgba(239,68,68,0.12)", color: "#ef4444",
            }}>
              <Flame size={11} />Trending
            </span>
          )}
        </div>
        <ArrowUpRight size={16} color="var(--text-muted)" />
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "1.1rem", fontWeight: 700,
        color: "var(--text-primary)", lineHeight: 1.4,
      }}>
        {business.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "0.875rem", color: "var(--text-secondary)",
        lineHeight: 1.65, flex: 1,
      }}>
        {business.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {business.tags.map((tag) => (
          <span key={tag} style={{
            padding: "3px 10px", borderRadius: "var(--radius-full)",
            fontSize: "0.72rem", fontWeight: 500,
            background: "var(--bg-primary)", color: "var(--text-muted)",
            border: "1px solid var(--border-color)",
          }}>
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px solid var(--border-color)",
      }}>
        {/* Owner */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `linear-gradient(135deg, ${business.avatarColor}, ${business.avatarColor}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 700, color: "#fff",
          }}>
            {business.ownerInitials}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            {business.owner}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <MessageCircle size={14} /> {business.comments}
          </span>
          <button
            id={`vote-btn-${business.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!voted) { setVotes(v => v + 1); setVoted(true); }
              else { setVotes(v => v - 1); setVoted(false); }
            }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: "var(--radius-full)",
              border: voted ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-color)",
              background: voted ? "rgba(239,68,68,0.1)" : "transparent",
              color: voted ? "#ef4444" : "var(--text-muted)",
              cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
              transition: "all var(--transition-fast)",
            }}
          >
            <Heart size={13} fill={voted ? "#ef4444" : "none"} /> {votes}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedBusinesses() {
  return (
    <section id="featured-businesses" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: "var(--radius-full)",
          background: "rgba(99,102,241,0.1)", color: "var(--accent-1)",
          fontSize: "0.8rem", fontWeight: 600, marginBottom: 16,
        }}>
          <Star size={13} fill="currentColor" /> Rising This Week
        </div>
        <h2 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
          color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 14,
        }}>
          Featured <span className="gradient-text">Businesses</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
          Standout brands the community is buzzing about.
        </p>
      </div>

      {/* Cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
        gap: 24,
      }}>
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {/* View all */}
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <a
          href="/businesses"
          id="view-all-ideas-btn"
          className="btn-ghost"
          style={{ fontSize: "0.9rem" }}
        >
          View all businesses <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
