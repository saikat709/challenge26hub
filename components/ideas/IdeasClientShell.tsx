"use client";

import { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, Flame, Clock, TrendingUp,
  Heart, MessageCircle, ArrowUpRight, X, ChevronDown,
  Leaf, Globe, Cpu, BookOpen, Heart as HeartIcon,
  Scale, Zap, Music, Filter,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────
const ALL_IDEAS = [
  {
    id: 1, title: "AI-Powered Urban Farming Grid",
    description: "Decentralized rooftop farms managed by AI to optimise yield and reduce urban food deserts. Sensors, drones, and community co-ops unite.",
    category: "Sustainability", categoryColor: "#10b981",
    votes: 342, comments: 57, views: 2840,
    author: "Aisha Rahman", authorInitials: "AR", avatarColor: "#6366f1",
    tags: ["AI", "Urban", "Food"], hot: true, createdAt: "2026-03-20",
  },
  {
    id: 2, title: "Decentralised Mental Health Network",
    description: "Peer-to-peer support circles backed by verified professionals. Anonymous, encrypted, community owned — no VC strings attached.",
    category: "Health", categoryColor: "#f43f5e",
    votes: 289, comments: 44, views: 1920,
    author: "Marcus Chen", authorInitials: "MC", avatarColor: "#8b5cf6",
    tags: ["Mental Health", "Web3", "Community"], hot: false, createdAt: "2026-03-19",
  },
  {
    id: 3, title: "Open-Source Civic Tech OS",
    description: "An operating system for local governments — transparent budgets, participatory voting, and real-time audit trails for every public spending decision.",
    category: "Governance", categoryColor: "#f59e0b",
    votes: 211, comments: 38, views: 1340,
    author: "Priya Nair", authorInitials: "PN", avatarColor: "#06b6d4",
    tags: ["Open Source", "Civic", "Transparency"], hot: false, createdAt: "2026-03-18",
  },
  {
    id: 4, title: "Ocean Plastic to Building Material",
    description: "Harvesting ocean plastic and converting it via a mobile processing plant into durable construction blocks for low-cost housing.",
    category: "Climate", categoryColor: "#06b6d4",
    votes: 401, comments: 72, views: 3100,
    author: "Kofi Asante", authorInitials: "KA", avatarColor: "#10b981",
    tags: ["Plastic", "Climate", "Housing"], hot: true, createdAt: "2026-03-22",
  },
  {
    id: 5, title: "Universal Learning Passport",
    description: "A globally-recognized digital credential that tracks skills, not degrees — from online courses, apprenticeships, and self-taught mastery.",
    category: "Education", categoryColor: "#f59e0b",
    votes: 187, comments: 29, views: 980,
    author: "Sofia Mendez", authorInitials: "SM", avatarColor: "#f59e0b",
    tags: ["EdTech", "Credentials", "Skills"], hot: false, createdAt: "2026-03-17",
  },
  {
    id: 6, title: "Neighbourhood Energy Microgrids",
    description: "Community-owned solar microgrids that let blocks of houses trade surplus electricity peer-to-peer, eliminating middlemen and bills.",
    category: "Energy", categoryColor: "#f97316",
    votes: 256, comments: 41, views: 1650,
    author: "Lars Eriksen", authorInitials: "LE", avatarColor: "#f97316",
    tags: ["Solar", "P2P", "Community"], hot: false, createdAt: "2026-03-21",
  },
  {
    id: 7, title: "AI Legislation Writer Assistant",
    description: "An AI co-pilot for lawmakers that drafts bills in plain language, simulates downstream effects, and flags conflicts with existing law.",
    category: "Technology", categoryColor: "#8b5cf6",
    votes: 318, comments: 63, views: 2200,
    author: "Yuki Tanaka", authorInitials: "YT", avatarColor: "#8b5cf6",
    tags: ["AI", "Policy", "LegalTech"], hot: true, createdAt: "2026-03-23",
  },
  {
    id: 8, title: "Living Archive of Oral Traditions",
    description: "A platform where indigenous communities digitize and control their own oral histories, myths, and music — with sovereign data rights.",
    category: "Arts & Culture", categoryColor: "#ec4899",
    votes: 143, comments: 22, views: 720,
    author: "Amara Diallo", authorInitials: "AD", avatarColor: "#ec4899",
    tags: ["Culture", "Heritage", "Indigenous"], hot: false, createdAt: "2026-03-16",
  },
  {
    id: 9, title: "Anonymous Whistleblower Protocol",
    description: "A cryptographically secure, decentralized protocol that lets journalists and whistleblowers communicate without metadata trails.",
    category: "Governance", categoryColor: "#f59e0b",
    votes: 276, comments: 55, views: 1890,
    author: "Chen Wei", authorInitials: "CW", avatarColor: "#6366f1",
    tags: ["Privacy", "Journalism", "Crypto"], hot: false, createdAt: "2026-03-14",
  },
  {
    id: 10, title: "Regenerative Fisheries Token",
    description: "A blockchain-backed quota system that financially rewards sustainable fishing practices and penalises overfishing in real time.",
    category: "Sustainability", categoryColor: "#10b981",
    votes: 194, comments: 31, views: 1100,
    author: "Nina Voronova", authorInitials: "NV", avatarColor: "#10b981",
    tags: ["Ocean", "Blockchain", "Fishing"], hot: false, createdAt: "2026-03-15",
  },
  {
    id: 11, title: "Global Disease Early Warning Network",
    description: "Crowdsourced symptom reporting + AI pattern-matching that detects outbreak clusters weeks before official health agencies do.",
    category: "Health", categoryColor: "#f43f5e",
    votes: 357, comments: 68, views: 2650,
    author: "Dr. James Osei", authorInitials: "JO", avatarColor: "#f43f5e",
    tags: ["Health", "AI", "Epidemiology"], hot: true, createdAt: "2026-03-22",
  },
  {
    id: 12, title: "Hyperlocal Manufacturing Hubs",
    description: "3D-printing fab labs embedded in every neighbourhood, letting anyone design and produce goods locally — shrinking global supply chains.",
    category: "Technology", categoryColor: "#8b5cf6",
    votes: 229, comments: 47, views: 1480,
    author: "Isabelle Renard", authorInitials: "IR", avatarColor: "#a78bfa",
    tags: ["3D-Print", "Local", "Manufacturing"], hot: false, createdAt: "2026-03-13",
  },
];

const CATEGORIES = [
  "All", "Sustainability", "Health", "Education", "Governance",
  "Climate", "Technology", "Energy", "Arts & Culture",
];

const SORT_OPTIONS = [
  { value: "votes",   label: "Most Voted",  icon: TrendingUp },
  { value: "newest",  label: "Newest",      icon: Clock      },
  { value: "hot",     label: "Trending",    icon: Flame      },
  { value: "views",   label: "Most Viewed", icon: ArrowUpRight },
];

// ─── IdeaCard ─────────────────────────────────────────────
function IdeaCard({ idea }: { idea: typeof ALL_IDEAS[0] }) {
  const [voted,  setVoted]  = useState(false);
  const [votes,  setVotes]  = useState(idea.votes);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      id={`idea-card-${idea.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    "var(--bg-card)",
        border:        `1px solid ${hovered ? "var(--border-hover)" : "var(--border-color)"}`,
        borderRadius:  "var(--radius-lg)",
        padding:       "26px",
        display:       "flex",
        flexDirection: "column",
        gap:           14,
        transition:    "all var(--transition-base)",
        transform:     hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow:     hovered ? "var(--shadow-lg)" : "var(--shadow-card)",
        position:      "relative",
        overflow:      "hidden",
        cursor:        "pointer",
      }}
    >
      {/* Gradient top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "var(--accent-gradient)",
        opacity: hovered ? 1 : 0.6,
        transition: "opacity var(--transition-base)",
      }} />

      {/* Category + badges */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{
            padding: "3px 11px", borderRadius: "var(--radius-full)",
            fontSize: "0.72rem", fontWeight: 600,
            background: `${idea.categoryColor}1a`, color: idea.categoryColor,
          }}>
            {idea.category}
          </span>
          {idea.hot && (
            <span style={{
              display: "flex", alignItems: "center", gap: 3,
              padding: "3px 9px", borderRadius: "var(--radius-full)",
              fontSize: "0.7rem", fontWeight: 600,
              background: "rgba(239,68,68,0.1)", color: "#ef4444",
            }}>
              <Flame size={10} /> Trending
            </span>
          )}
        </div>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
          {new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "1.05rem", fontWeight: 700,
        color: "var(--text-primary)", lineHeight: 1.4,
      }}>
        {idea.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "0.86rem", color: "var(--text-secondary)",
        lineHeight: 1.65, flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {idea.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {idea.tags.map((tag) => (
          <span key={tag} style={{
            padding: "2px 9px", borderRadius: "var(--radius-full)",
            fontSize: "0.7rem", fontWeight: 500,
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
        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `linear-gradient(135deg, ${idea.avatarColor}, ${idea.avatarColor}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.65rem", fontWeight: 700, color: "#fff",
          }}>
            {idea.authorInitials}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            {idea.author}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: "0.78rem", color: "var(--text-muted)",
          }}>
            <MessageCircle size={13} /> {idea.comments}
          </span>
          <button
            id={`vote-btn-idea-${idea.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setVoted(v => !v);
              setVotes(v => voted ? v - 1 : v + 1);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 12px", borderRadius: "var(--radius-full)",
              border:      voted ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-color)",
              background:  voted ? "rgba(239,68,68,0.1)" : "transparent",
              color:       voted ? "#ef4444" : "var(--text-muted)",
              cursor:      "pointer", fontWeight: 600, fontSize: "0.78rem",
              transition:  "all var(--transition-fast)",
            }}
          >
            <Heart size={12} fill={voted ? "#ef4444" : "none"} /> {votes}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Main Shell ───────────────────────────────────────────
export default function IdeasClientShell() {
  const [search,        setSearch]        = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort,          setSort]          = useState("votes");
  const [showFilters,   setShowFilters]   = useState(false);
  const [sortOpen,      setSortOpen]      = useState(false);

  const filtered = useMemo(() => {
    let ideas = [...ALL_IDEAS];

    // Category
    if (activeCategory !== "All") {
      ideas = ideas.filter(i => i.category === activeCategory);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      ideas = ideas.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        i.author.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "votes":  ideas.sort((a, b) => b.votes - a.votes);   break;
      case "newest": ideas.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "hot":    ideas.sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.votes - a.votes); break;
      case "views":  ideas.sort((a, b) => b.views - a.views);   break;
    }

    return ideas;
  }, [search, activeCategory, sort]);

  const currentSort = SORT_OPTIONS.find(s => s.value === sort)!;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: "var(--radius-full)",
          background: "rgba(99,102,241,0.1)", color: "var(--accent-1)",
          fontSize: "0.78rem", fontWeight: 600, marginBottom: 14,
        }}>
          <Filter size={12} /> Idea Explorer
        </div>
        <h1 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900,
          letterSpacing: "-0.03em", color: "var(--text-primary)",
          lineHeight: 1.12, marginBottom: 10,
        }}>
          Browse All <span className="gradient-text">Ideas</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          {ALL_IDEAS.length} ideas across {CATEGORIES.length - 1} categories · updated daily
        </p>
      </div>

      {/* ── Search + Sort bar ── */}
      <div style={{
        display: "flex", gap: 12, alignItems: "center",
        marginBottom: 24, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{
          flex: 1, minWidth: 240,
          position: "relative", display: "flex", alignItems: "center",
        }}>
          <Search size={16} style={{
            position: "absolute", left: 14, color: "var(--text-muted)",
            pointerEvents: "none",
          }} />
          <input
            id="ideas-search-input"
            type="text"
            placeholder="Search ideas, tags, authors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 40px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color var(--transition-fast)",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--accent-1)")}
            onBlur={e  => (e.target.style.borderColor = "var(--border-color)")}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 12,
                background: "none", border: "none",
                cursor: "pointer", color: "var(--text-muted)",
                display: "flex", alignItems: "center",
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div style={{ position: "relative" }}>
          <button
            id="sort-dropdown-btn"
            onClick={() => setSortOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "11px 18px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "0.86rem", fontWeight: 500, cursor: "pointer",
              transition: "all var(--transition-fast)",
              whiteSpace: "nowrap",
            }}
          >
            <currentSort.icon size={14} color="var(--accent-1)" />
            {currentSort.label}
            <ChevronDown size={13} style={{
              transition: "transform var(--transition-fast)",
              transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
            }} />
          </button>

          {sortOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden", zIndex: 100, minWidth: 160,
            }}>
              {SORT_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const active = sort === opt.value;
                return (
                  <button
                    key={opt.value}
                    id={`sort-opt-${opt.value}`}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 16px", border: "none", cursor: "pointer",
                      background: active ? "rgba(99,102,241,0.1)" : "transparent",
                      color: active ? "var(--accent-1)" : "var(--text-secondary)",
                      fontSize: "0.86rem", fontWeight: active ? 600 : 400,
                      transition: "all var(--transition-fast)",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--border-color)"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <Icon size={14} /> {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter toggle */}
        <button
          id="filter-toggle-btn"
          onClick={() => setShowFilters(f => !f)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "11px 18px",
            borderRadius: "var(--radius-full)",
            border: showFilters
              ? "1px solid var(--accent-1)"
              : "1px solid var(--border-color)",
            background: showFilters ? "rgba(99,102,241,0.1)" : "var(--bg-card)",
            color: showFilters ? "var(--accent-1)" : "var(--text-secondary)",
            fontSize: "0.86rem", fontWeight: 500, cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          <SlidersHorizontal size={14} /> Filters
          {activeCategory !== "All" && (
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--accent-1)", marginLeft: 2,
            }} />
          )}
        </button>
      </div>

      {/* ── Category filter pills ── */}
      {showFilters && (
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24,
          padding: "16px 20px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
        }}>
          {CATEGORIES.map(cat => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat}`}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 16px", borderRadius: "var(--radius-full)",
                  border: active ? "1px solid var(--accent-1)" : "1px solid var(--border-color)",
                  background: active ? "rgba(99,102,241,0.12)" : "transparent",
                  color: active ? "var(--accent-1)" : "var(--text-secondary)",
                  fontSize: "0.82rem", fontWeight: active ? 600 : 400,
                  cursor: "pointer", transition: "all var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Results meta ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 20,
      }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {filtered.length === 0
            ? "No ideas found"
            : `Showing ${filtered.length} idea${filtered.length !== 1 ? "s" : ""}`}
          {activeCategory !== "All" && (
            <> in <strong style={{ color: "var(--text-primary)" }}>{activeCategory}</strong></>
          )}
          {search && (
            <> for <strong style={{ color: "var(--text-primary)" }}>"{search}"</strong></>
          )}
        </span>
        {(activeCategory !== "All" || search) && (
          <button
            id="clear-filters-btn"
            onClick={() => { setActiveCategory("All"); setSearch(""); }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              background: "transparent", color: "var(--text-muted)",
              fontSize: "0.78rem", cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* ── Ideas Grid ── */}
      {filtered.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
          gap: 24,
        }}>
          {filtered.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "80px 24px", gap: 14, textAlign: "center",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "var(--radius-xl)",
            background: "rgba(99,102,241,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem",
          }}>
            💡
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            No ideas found
          </h3>
          <p style={{ color: "var(--text-muted)", maxWidth: 360 }}>
            Try a different search or category. Or be the first to submit an idea in this space!
          </p>
          <a href="/submit" className="btn-primary" style={{ marginTop: 8 }}>
            Submit an Idea
          </a>
        </div>
      )}

      {/* ── Overlay to close sort dropdown ── */}
      {sortOpen && (
        <div
          onClick={() => setSortOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
        />
      )}
    </div>
  );
}
