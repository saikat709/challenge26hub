"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 72px" }}>
          <header style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12 }}>
              Profile
            </p>
            <h1 style={{ margin: "6px 0 8px", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-0.02em" }}>
              Your account
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: 620 }}>
              View your details and jump into creating a business listing.
            </p>
          </header>

          {status === "loading" ? (
            <div style={{ padding: 24 }}>Checking session…</div>
          ) : !user ? (
            <div style={{ padding: 24, border: "1px solid var(--border-color)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>Sign in to view your profile</h3>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>Access saved businesses and create new listings.</p>
              </div>
              <button className="btn-primary" onClick={() => signIn()} style={{ padding: "10px 16px" }}>
                Sign in
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              <section style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: 18, background: "var(--bg-card)", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-secondary)", display: "grid", placeItems: "center", fontWeight: 800, border: "1px solid var(--border-color)" }}>
                    {(user.name || user.email || "").slice(0, 2).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text-primary)" }}>{user.name || "Unnamed user"}</div>
                    <div style={{ color: "var(--text-secondary)" }}>{user.email || "No email"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/businesses/create" className="btn-primary" style={{ padding: "10px 16px", textDecoration: "none" }}>
                    Create a business
                  </Link>
                  <Link href="/businesses" className="btn-ghost" style={{ padding: "10px 16px", textDecoration: "none" }}>
                    Browse businesses
                  </Link>
                  <button className="btn-ghost" onClick={() => signOut()} style={{ padding: "10px 16px" }}>
                    Sign out
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
