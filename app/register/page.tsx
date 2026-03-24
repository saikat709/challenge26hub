"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Could not register");
      setLoading(false);
      return;
    }
    await signIn("credentials", { redirect: false, email, password, callbackUrl: "/businesses" });
    router.push("/businesses");
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 10 }}>Create your account</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Register to add businesses and upload brand assets.</p>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </label>
            {error && <div style={{ color: "#ef4444" }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "10px 14px" }}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <div style={{ marginTop: 18 }}>
            <Link href="/login" className="btn-ghost">Have an account? Sign in</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
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
