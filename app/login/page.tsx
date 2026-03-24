"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { redirect: false, email, password, callbackUrl: "/businesses" });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/businesses");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 24px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 10 }}>Welcome back</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Sign in with email/password or Google.</p>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </label>
            {error && <div style={{ color: "#ef4444" }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "10px 14px" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-ghost" onClick={() => signIn("google", { callbackUrl: "/businesses" })}>
              Sign in with Google
            </button>
            <Link href="/register" className="btn-ghost">Create an account</Link>
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
