const faqs = [
  {
    question: "What is Challenge 26?",
    answer:
      "A public hub for sharing, discovering, and validating new businesses across 26 categories. It is built to help founders launch faster.",
  },
  {
    question: "How do businesses get featured?",
    answer:
      "The community votes, comments, and shares. The most active and promising ideas rise to the top each week.",
  },
  {
    question: "Can I submit a business if it is just an idea?",
    answer:
      "Yes. Early ideas are welcome. The goal is to get feedback, shape the pitch, and build traction before launch.",
  },
  {
    question: "Is this only for startups?",
    answer:
      "No. Solo founders, side projects, and local businesses are all part of the Challenge 26 ecosystem.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faqs"
      style={{
        padding: "80px 24px 110px",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(14,165,233,0.12)",
              color: "#0ea5e9",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            FAQs
          </span>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: 12,
            }}
          >
            Answers before you launch
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Quick clarity for founders, voters, and future collaborators.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {faqs.map((faq, i) => (
            <details
              key={i}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 20px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              >
                {faq.question}
              </summary>
              <p style={{ marginTop: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
