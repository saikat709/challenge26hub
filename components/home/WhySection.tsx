import { BadgeCheck, Compass, Users2 } from "lucide-react";

const reasons = [
  {
    icon: Compass,
    title: "Turn ideas into momentum",
    description:
      "Challenge 26 exists to turn early-stage ideas into visible momentum with feedback, votes, and real-world validation.",
  },
  {
    icon: Users2,
    title: "Build with community pressure",
    description:
      "Founders move faster when peers are watching. This space is a public launchpad for teams, solo builders, and challengers.",
  },
  {
    icon: BadgeCheck,
    title: "Spot the next breakout",
    description:
      "Discover new businesses before they are everywhere. Every week the community surfaces the standouts worth betting on.",
  },
];

export default function WhySection() {
  return (
    <section
      id="why-this-exists"
      style={{
        padding: "90px 24px",
        background: "linear-gradient(180deg, var(--bg-secondary), transparent)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(16,185,129,0.12)",
              color: "#10b981",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            Why this exists
          </span>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: 12,
            }}
          >
            A home for bold business launches
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1rem",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Challenge 26 helps builders move from idea to launch by showcasing real businesses and the people behind them.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(99,102,241,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color="var(--accent-1)" />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {reason.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
