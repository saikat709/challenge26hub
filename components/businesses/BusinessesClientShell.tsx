"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useSession, signIn } from "next-auth/react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import ShareButtons from "@/components/businesses/ShareButtons";
import {
  Search,
  SlidersHorizontal,
  ExternalLink,
  Link2,
  Globe2,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Check,
} from "lucide-react";

import Link from "next/link";

type Category = { id: string; name: string; slug: string };

type Business = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  comment?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  pageLink?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  category?: Category | null;
  owner?: { name?: string | null; email?: string | null } | null;
};

const fallbackCategories: Category[] = [
  { id: "cat-food", name: "Cat food", slug: "cat-food" },
  { id: "food", name: "Food", slug: "food" },
  { id: "clothing", name: "Clothing", slug: "clothing" },
  { id: "baby-toys", name: "Baby toys", slug: "baby-toys" },
  { id: "health", name: "Health", slug: "health" },
  { id: "technology", name: "Technology", slug: "technology" },
  { id: "energy", name: "Energy", slug: "energy" },
  { id: "arts-culture", name: "Arts & Culture", slug: "arts-culture" },
];

const buttonStyle: CSSProperties = {
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

export default function BusinessesClientShell() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    comment: "",
    pageLink: "",
    instagramUrl: "",
    websiteUrl: "",
  });
  const [logo, setLogo] = useState<{ url?: string; key?: string }>({});
  const [cover, setCover] = useState<{ url?: string; key?: string }>({});
  const [categoryId, setCategoryId] = useState<string>("all");
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const json = await res.json();
          setCategories(json.categories ?? fallbackCategories);
        }
      } catch (e) {
        console.error(e);
        setCategories(fallbackCategories);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingList(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (activeCategory !== "all") params.set("categoryId", activeCategory);
        const res = await fetch(`/api/businesses${params.toString() ? `?${params.toString()}` : ""}`);
        const json = await res.json();
        setBusinesses(json.businesses ?? []);
      } catch (e) {
        console.error(e);
        setBusinesses([]);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, [search, activeCategory]);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoadingCreate(true);
    try {
      const payload = {
        ...form,
        categoryId: categoryId === "add-new" ? undefined : categoryId !== "all" ? categoryId : undefined,
        newCategoryName: categoryId === "add-new" ? newCategory : undefined,
        logoUrl: logo.url,
        logoKey: logo.key,
        coverUrl: cover.url,
        coverKey: cover.key,
      };
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Could not create business");
      }
      const json = await res.json();
      setBusinesses((prev) => [json.business, ...prev]);
      setForm({ name: "", description: "", comment: "", pageLink: "", instagramUrl: "", websiteUrl: "" });
      setLogo({});
      setCover({});
      setCategoryId("all");
      setNewCategory("");
      setMessage("Business saved and visible to everyone.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
      <header style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: "var(--radius-full)",
          background: "rgba(99,102,241,0.12)", color: "var(--accent-1)",
          fontSize: "0.85rem", fontWeight: 700,
        }}>
          <Sparkles size={14} /> Business Directory
        </div>
        <h1 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900,
          letterSpacing: "-0.03em", color: "var(--text-primary)",
          lineHeight: 1.1, marginTop: 12,
        }}>
          Browse and Share <span className="gradient-text">Businesses</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
          Anyone can explore names and logos. Sign in to add your brand, upload logos and covers, and generate share links or QR codes.
        </p>
      </header>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search businesses by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 40px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            style={{
              padding: "12px 18px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              minWidth: 200,
            }}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setActiveCategory("all"); setSearch(""); }}
          style={{ ...buttonStyle, padding: "10px 14px" }}
        >
          <SlidersHorizontal size={14} /> Reset
        </button>
      </div>

      {/* Create form */}
      <section style={{
        marginBottom: 40,
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        padding: 20,
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-md)",
      }}>
        {session?.user ? (
          <form onSubmit={handleCreateBusiness} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Business name</span>
                <input
                  id="business-name-input"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Cats & Co. Gourmet"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Category</span>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="all">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  <option value="add-new">+ Add category</option>
                </select>
              </label>
            </div>
            {categoryId === "add-new" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  style={{ ...inputStyle, flex: 1, minWidth: 220 }}
                />
                <button type="button" style={buttonStyle} onClick={async () => {
                  if (!newCategory.trim()) return;
                  const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategory }) });
                  const json = await res.json();
                  if (json?.category) {
                    setCategories((prev) => [...prev, json.category]);
                    setCategoryId(json.category.id);
                    setMessage(`Added category ${json.category.name}`);
                  }
                }}>
                  <Plus size={14} /> Save category
                </button>
              </div>
            )}
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short overview"
                style={{ ...inputStyle, minHeight: 90 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Comment</span>
              <textarea
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Leave a note or tagline"
                style={{ ...inputStyle, minHeight: 70 }}
              />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Page link</span>
                <input
                  value={form.pageLink}
                  onChange={(e) => setForm((f) => ({ ...f, pageLink: e.target.value }))}
                  placeholder="https://your-site.com"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Instagram</span>
                <input
                  value={form.instagramUrl}
                  onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/yourbrand"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Website</span>
                <input
                  value={form.websiteUrl}
                  onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                  placeholder="https://"
                  style={inputStyle}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}><ImageIcon size={14} /> Brand logo</span>
                <UploadButton<OurFileRouter, "businessBrand">
                  endpoint="businessBrand"
                  onClientUploadComplete={(res) => {
                    const file = res?.[0];
                    if (file) setLogo({ url: file.url, key: file.key });
                  }}
                  onUploadError={(error) => setMessage(error.message)}
                />
                {logo.url && <img src={logo.url} alt="Logo preview" style={{ maxWidth: 180, borderRadius: 12, border: "1px solid var(--border-color)" }} />}
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}><ImageIcon size={14} /> Cover image</span>
                <UploadButton<OurFileRouter, "businessCover">
                  endpoint="businessCover"
                  onClientUploadComplete={(res) => {
                    const file = res?.[0];
                    if (file) setCover({ url: file.url, key: file.key });
                  }}
                  onUploadError={(error) => setMessage(error.message)}
                />
                {cover.url && <img src={cover.url} alt="Cover preview" style={{ maxWidth: 240, borderRadius: 12, border: "1px solid var(--border-color)" }} />}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button type="submit" className="btn-primary" disabled={loadingCreate} style={{ padding: "10px 16px" }}>
                {loadingCreate ? <Loader2 size={16} className="spin" /> : <Check size={16} />} Save business
              </button>
              {message && <span style={{ color: "var(--text-secondary)" }}>{message}</span>}
            </div>
          </form>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-primary)", fontWeight: 800 }}>Sign in to add your business</h3>
              <p style={{ color: "var(--text-secondary)" }}>Upload logos, covers, and generate share links once logged in.</p>
            </div>
            <button className="btn-primary" onClick={() => signIn()} style={{ padding: "10px 16px" }}>
              Sign in
            </button>
          </div>
        )}
      </section>

      {/* Results */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: "var(--text-muted)" }}>
          {loadingList ? "Loading businesses…" : `${businesses.length} business${businesses.length === 1 ? "" : "es"}`} visible
        </span>
        <Link href="/brand-images" style={{ ...buttonStyle, textDecoration: "none" }}>
          <ImageIcon size={14} /> View brand images
        </Link>
      </div>

      {loadingList ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}>
          <Loader2 size={18} className="spin" /> Fetching businesses…
        </div>
      ) : businesses.length === 0 ? (
        <div style={{ padding: 32, border: "1px solid var(--border-color)", borderRadius: 16, textAlign: "center" }}>
          <p style={{ marginBottom: 12 }}>No businesses yet. Be the first to add one.</p>
          {session?.user ? (
            <button className="btn-primary" onClick={() => document.getElementById("business-name-input")?.scrollIntoView({ behavior: "smooth" })}>Create business</button>
          ) : (
            <button className="btn-primary" onClick={() => signIn()}>Sign in to create</button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(360px, 100%), 1fr))", gap: 18 }}>
          {businesses.map((biz) => (
            <article key={biz.id} style={{
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: 18,
              background: "var(--bg-card)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {biz.logoUrl ? (
                  <img src={biz.logoUrl} alt={`${biz.name} logo`} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 14, border: "1px solid var(--border-color)" }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                    {biz.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: "var(--text-primary)", fontWeight: 800 }}>{biz.name}</h3>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{biz.description || "No description yet."}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                    {biz.category?.name && (
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: "var(--bg-secondary)", border: "1px solid var(--border-color)", fontSize: "0.78rem" }}>
                        {biz.category.name}
                      </span>
                    )}
                    {biz.owner?.name && (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>By {biz.owner.name}</span>
                    )}
                  </div>
                </div>
              </div>

              {biz.coverUrl && <img src={biz.coverUrl} alt={`${biz.name} cover`} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, border: "1px solid var(--border-color)" }} />}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {biz.pageLink && <a href={biz.pageLink} target="_blank" rel="noreferrer" style={chip}><ExternalLink size={12} /> Site</a>}
                {biz.instagramUrl && <a href={biz.instagramUrl} target="_blank" rel="noreferrer" style={chip}><Link2 size={12} /> Instagram</a>}
                {biz.websiteUrl && !biz.pageLink && <a href={biz.websiteUrl} target="_blank" rel="noreferrer" style={chip}><Globe2 size={12} /> Website</a>}
              </div>

              {biz.comment && <p style={{ color: "var(--text-secondary)", margin: 0 }}>{biz.comment}</p>}

              <ShareButtons slug={biz.slug} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-color)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
};

const chip: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  textDecoration: "none",
  fontSize: "0.8rem",
};
