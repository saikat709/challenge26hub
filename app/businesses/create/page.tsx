"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  Plus,
  Loader2,
  Check,
  Folder,
  Image as ImageIcon,
  Tag,
  ShoppingBag,
  Utensils,
  HeartPulse,
  Cpu,
  Sparkles,
  Leaf,
  Baby,
  Shirt,
  Palette,
} from "lucide-react";

import "@uploadthing/react/styles.css";

type Category = { id: string; name: string; slug: string };

function iconForCategory(name: string) {
  const n = name.toLowerCase();
  if (n.includes("food") || n.includes("restaurant") || n.includes("cafe")) return Utensils;
  if (n.includes("cat") || n.includes("pet")) return Sparkles;
  if (n.includes("cloth")) return Shirt;
  if (n.includes("baby")) return Baby;
  if (n.includes("health") || n.includes("med")) return HeartPulse;
  if (n.includes("tech") || n.includes("software") || n.includes("app")) return Cpu;
  if (n.includes("energy") || n.includes("green") || n.includes("eco")) return Leaf;
  if (n.includes("art") || n.includes("culture") || n.includes("design")) return Palette;
  if (n.includes("shop") || n.includes("retail")) return ShoppingBag;
  return Tag;
}

export default function CreateBusinessPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const json = await res.json();
          const cats = json.categories ?? [];
          setCategories(cats);
          if (!selectedCategoryId && cats.length > 0) setSelectedCategoryId(cats[0].id);
        } else {
          setCategories([]);
          setMessage("Could not load categories from API");
        }
      } catch (err) {
        console.error(err);
        setCategories([]);
        setMessage("Could not reach categories API");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setMessage(null);
    setAddingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not add category");
      const cat = json.category;
      if (cat) {
        setCategories((prev) => [...prev, cat]);
        setSelectedCategoryId(cat.id);
        setNewCategoryName("");
        setMessage(`Added category ${cat.name}`);
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setAddingCategory(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      if (!selectedCategoryId) {
        setMessage("Select a category first");
        setStep(1);
        return;
      }

      const payload = {
        ...form,
        categoryId: selectedCategoryId,
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
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not create business");
      setMessage("Business created and published.");
      setForm({ name: "", description: "", comment: "", pageLink: "", instagramUrl: "", websiteUrl: "" });
      setLogo({});
      setCover({});
      if (categories.length > 0) setSelectedCategoryId(categories[0].id);
      setStep(1);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const hero = useMemo(
    () => ({
      background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(14,165,233,0.12))",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius-xl)",
      padding: "20px 20px 26px",
    }),
    []
  );

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 72px" }}>
          <section style={hero}>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12 }}>
              Create business
            </p>
            <h1 style={{ margin: "6px 0 8px", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-0.02em" }}>
              Launch a listing
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: 680 }}>
              Pick a category from the cards, drop in a logo and cover, and publish your business. Categories come from the database, and you can add one with the plus card.
            </p>
          </section>

          {status === "loading" ? (
            <div style={{ padding: 32 }}>Checking session…</div>
          ) : !session ? (
            <div style={{ marginTop: 20, padding: 24, border: "1px solid var(--border-color)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>Sign in to create a business</h3>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>You need an account to upload images and save listings.</p>
              </div>
              <button className="btn-primary" onClick={() => signIn()} style={{ padding: "10px 16px" }}>
                Sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 24, display: "grid", gap: 20 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    ...pill,
                    background: step === 1 ? "var(--accent-gradient, #6366f1)" : "var(--bg-secondary)",
                    color: step === 1 ? "#fff" : "var(--text-primary)",
                  }}
                  aria-pressed={step === 1}
                >
                  1. Choose category
                </button>
                <button
                  type="button"
                  onClick={() => selectedCategoryId && setStep(2)}
                  style={{
                    ...pill,
                    background: step === 2 ? "var(--accent-gradient, #6366f1)" : "var(--bg-secondary)",
                    color: step === 2 ? "#fff" : "var(--text-primary)",
                    opacity: selectedCategoryId ? 1 : 0.55,
                    cursor: selectedCategoryId ? "pointer" : "not-allowed",
                  }}
                  aria-pressed={step === 2}
                >
                  2. Details & upload
                </button>
              </div>

              {step === 1 && (
                <section style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: 18, background: "var(--bg-card)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Folder size={16} />
                    <strong>Categories</strong>
                    {loadingCategories && <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading…</span>}
                  </div>
                  {categories.length === 0 && !loadingCategories ? (
                    <div style={{ color: "var(--text-secondary)", padding: 8 }}>No categories yet. Add one with the plus card.</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                      {categories.map((cat) => {
                        const active = selectedCategoryId === cat.id;
                        const Icon = iconForCategory(cat.name);
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            style={{
                              ...cardStyle,
                              borderColor: active ? "var(--accent-1)" : "var(--border-color)",
                              boxShadow: active ? "0 10px 30px rgba(99,102,241,0.15)" : "var(--shadow-sm)",
                            }}
                          >
                            <div style={badge}><Icon size={18} /></div>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ fontWeight: 700 }}>{cat.name}</div>
                              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>From database</div>
                            </div>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setAddingCategory((v) => !v)}
                        style={{ ...cardStyle, borderStyle: "dashed", color: "var(--text-muted)", justifyContent: "center" }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <div style={{ ...badge, background: "rgba(99,102,241,0.12)", color: "var(--accent-1)" }}>
                            <Plus size={18} />
                          </div>
                          <span>Add category</span>
                        </div>
                      </button>
                    </div>
                  )}
                  {addingCategory && (
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                        style={{ ...inputStyle, flex: 1, minWidth: 240 }}
                      />
                      <button type="button" className="btn-primary" onClick={handleAddCategory} disabled={!newCategoryName.trim() || addingCategory} style={{ padding: "10px 14px" }}>
                        {addingCategory ? <Loader2 size={16} className="spin" /> : <Check size={16} />} Save
                      </button>
                    </div>
                  )}

                  <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => selectedCategoryId && setStep(2)}
                      disabled={!selectedCategoryId}
                      style={{ padding: "10px 16px" }}
                    >
                      Next: details
                    </button>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: 18, background: "var(--bg-card)", display: "grid", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 700 }}>Business name</span>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g., Cats & Co. Gourmet"
                        style={inputStyle}
                      />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 700 }}>Tagline</span>
                      <input
                        value={form.comment}
                        onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                        placeholder="Short punchy line"
                        style={inputStyle}
                      />
                    </label>
                  </div>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 700 }}>Description</span>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="What makes this business special?"
                      style={{ ...inputStyle, minHeight: 110 }}
                    />
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 700 }}>Page link</span>
                      <input
                        value={form.pageLink}
                        onChange={(e) => setForm((f) => ({ ...f, pageLink: e.target.value }))}
                        placeholder="https://your-site.com"
                        style={inputStyle}
                      />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 700 }}>Instagram</span>
                      <input
                        value={form.instagramUrl}
                        onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
                        placeholder="https://instagram.com/yourbrand"
                        style={inputStyle}
                      />
                    </label>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={{ fontWeight: 700 }}>Website</span>
                      <input
                        value={form.websiteUrl}
                        onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                        placeholder="https://"
                        style={inputStyle}
                      />
                    </label>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: 18, background: "var(--bg-card)", display: "grid", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                    <div style={{ display: "grid", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                        <ImageIcon size={16} /> Brand logo
                      </div>
                      <div style={dropShell}>
                        <UploadDropzone<OurFileRouter, "businessBrand">
                          endpoint="businessBrand"
                          onClientUploadComplete={(res) => {
                            const file = res?.[0];
                            if (file) setLogo({ url: file.url, key: file.key });
                          }}
                          onUploadError={(error) => setMessage(error.message)}
                        />
                      </div>
                      {logo.url && <img src={logo.url} alt="Logo preview" style={{ maxWidth: 180, borderRadius: 12, border: "1px solid var(--border-color)" }} />}
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                        <ImageIcon size={16} /> Cover image
                      </div>
                      <div style={dropShell}>
                        <UploadDropzone<OurFileRouter, "businessCover">
                          endpoint="businessCover"
                          onClientUploadComplete={(res) => {
                            const file = res?.[0];
                            if (file) setCover({ url: file.url, key: file.key });
                          }}
                          onUploadError={(error) => setMessage(error.message)}
                        />
                      </div>
                      {cover.url && <img src={cover.url} alt="Cover preview" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid var(--border-color)" }} />}
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" className="btn-ghost" onClick={() => setStep(1)} style={{ padding: "10px 14px" }}>
                    Back to category
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving} style={{ padding: "10px 16px" }}>
                    {saving ? <Loader2 size={16} className="spin" /> : <Check size={16} />} Publish business
                  </button>
                  {message && <span style={{ color: "var(--text-secondary)" }}>{message}</span>}
                </div>
              )}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

const cardStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  border: "1px solid var(--border-color)",
  borderRadius: 16,
  padding: "12px 14px",
  background: "var(--bg-secondary)",
  cursor: "pointer",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
};

const badge: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: "rgba(99,102,241,0.12)",
  display: "grid",
  placeItems: "center",
  color: "var(--accent-1)",
};

const pill: CSSProperties = {
  borderRadius: "var(--radius-full)",
  padding: "10px 16px",
  border: "1px solid var(--border-color)",
  fontWeight: 700,
  transition: "all 0.2s ease",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-color)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
};

const dropShell: CSSProperties = {
  border: "1px dashed var(--border-color)",
  borderRadius: 16,
  padding: 10,
  background: "var(--bg-secondary)",
};
