import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const business = await prisma.business.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ business });
}
