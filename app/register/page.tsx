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
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
            Register to add businesses and upload brand assets. Or continue with Google if you already use it to sign in.
          </p>
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
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gap: 10,
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            <button
              className="btn-ghost"
              onClick={() => signIn("google", { callbackUrl: "/businesses" })}
              style={{ justifyContent: "center", gap: 10 }}
            >
              <svg aria-hidden focusable="false" width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#EA4335"
                  d="M9 7.31v3.16h4.45c-.2 1.12-.83 2.07-1.77 2.7v2.25h2.86c1.67-1.54 2.63-3.81 2.63-6.5 0-.62-.06-1.21-.18-1.78H9z"
                />
                <path
                  fill="#34A853"
                  d="M4.96 10.71l-.78.6-2.3 1.8C2.97 15.83 5.78 17.5 9 17.5c2.43 0 4.47-.8 5.96-2.18l-2.86-2.25c-.77.52-1.75.83-3.1.83-2.38 0-4.4-1.6-5.12-3.79z"
                />
                <path
                  fill="#4A90E2"
                  d="M1.88 5.89C1.32 7.24 1 8.59 1 10s.32 2.76.88 4.11l3.08-2.39C4.81 10.6 4.8 9.4 4.96 8.3V5.89H1.88z"
                />
                <path
                  fill="#FBBC05"
                  d="M9 3.5c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.46 1.02 11.43.25 9 .25 5.78.25 2.97 1.92 1.26 4.49l3.7 2.85C4.6 5.1 6.62 3.5 9 3.5z"
                />
              </svg>
              Continue with Google
            </button>
            <Link href="/login" className="btn-ghost" style={{ justifyContent: "center" }}>
              Have an account? Sign in
            </Link>
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
