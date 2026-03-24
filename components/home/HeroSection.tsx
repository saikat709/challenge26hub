"use client";

import type { LucideIcon } from "lucide-react";
import { Sparkles, ArrowRight, Rocket, Users, Trophy, Lightbulb } from "lucide-react";
import Link from "next/link";

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Lightbulb, value: "2,600+", label: "Ideas Submitted" },
  { icon: Users,     value: "840+",   label: "Contributors" },
  { icon: Trophy,    value: "26",     label: "Challenge Categories" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "15%", left: "10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "8%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          animation: "float 7s ease-in-out infinite 2s",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(var(--border-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }} />
      </div>

      {/* Badge */}
      <div
        className="anim-fade-up glass"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 18px", borderRadius: "var(--radius-full)",
          marginBottom: 32, fontSize: "0.85rem", fontWeight: 600,
          color: "var(--accent-1)",
        }}
      >
        <Sparkles size={14} />
        <span>Challenge 26 Ideas Hub · Season 2026</span>
      </div>

      {/* Headline */}
      <h1
        className="anim-fade-up delay-100"
        style={{
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: "-0.04em",
          maxWidth: 900,
          marginBottom: 24,
          color: "var(--text-primary)",
        }}
      >
        Where Bold Ideas{" "}
        <span className="gradient-text">Take Shape</span>
      </h1>

      {/* Subtitle */}
      <p
        className="anim-fade-up delay-200"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-secondary)",
          maxWidth: 580,
          lineHeight: 1.7,
          marginBottom: 44,
        }}
      >
        Submit, explore, and vote on the most innovative ideas across 26 challenge categories.
        Join a community that turns imagination into impact.
      </p>

      {/* CTAs */}
      <div
        className="anim-fade-up delay-300"
        style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}
      >
        <Link href="/ideas" id="hero-explore-btn" className="btn-primary">
          <Rocket size={16} />
          <span>Explore Ideas</span>
          <ArrowRight size={15} />
        </Link>
        <Link href="/submit" id="hero-submit-btn" className="btn-ghost">
          <Sparkles size={15} />
          <span>Submit Your Idea</span>
        </Link>
      </div>

      {/* Stats */}
      <div
        className="anim-fade-up delay-400"
        style={{
          display: "flex", gap: 0, flexWrap: "wrap", justifyContent: "center",
          background: "var(--bg-card)", border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)", overflow: "hidden",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              id={`hero-stat-${i}`}
              style={{
                padding: "24px 40px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                borderRight: i < stats.length - 1 ? "1px solid var(--border-color)" : "none",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <Icon size={20} color="var(--accent-1)" />
              <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
