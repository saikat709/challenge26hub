import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/businesses/ShareButtons";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await prisma.business.findUnique({ where: { slug: params.slug } });
  if (!business) return { title: "Business not found" };
  return {
    title: `${business.name} · C26Hub`,
    description: business.description || "Business profile",
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      owner: { select: { name: true, email: true } },
    },
  });

  if (!business) notFound();

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 88 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={`${business.name} logo`} style={{ width: 72, height: 72, borderRadius: 18, border: "1px solid var(--border-color)", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: 18, background: "var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                {business.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>{business.name}</h1>
              {business.category?.name && (
                <span style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", fontSize: "0.85rem" }}>
                  {business.category.name}
                </span>
              )}
              {business.owner?.name && (
                <div style={{ color: "var(--text-secondary)", marginTop: 6 }}>Added by {business.owner.name}</div>
              )}
            </div>
          </div>

          {business.coverUrl && (
            <img src={business.coverUrl} alt={`${business.name} cover`} style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 16, border: "1px solid var(--border-color)", marginBottom: 18 }} />
          )}

          {business.description && <p style={{ color: "var(--text-primary)", fontSize: "1rem" }}>{business.description}</p>}
          {business.comment && <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>{business.comment}</p>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "12px 0" }}>
            {business.pageLink && <a href={business.pageLink} target="_blank" rel="noreferrer" className="btn-ghost">Visit page</a>}
            {business.instagramUrl && <a href={business.instagramUrl} target="_blank" rel="noreferrer" className="btn-ghost">Instagram</a>}
            {business.websiteUrl && <a href={business.websiteUrl} target="_blank" rel="noreferrer" className="btn-ghost">Website</a>}
          </div>

          <ShareButtons slug={business.slug} />
        </div>
      </main>
      <Footer />
    </>
  );
}
