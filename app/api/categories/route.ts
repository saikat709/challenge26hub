import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = (body?.name as string | undefined)?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);
  const existing = await prisma.category.findFirst({ where: { OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }] } });
  if (existing) {
    return NextResponse.json({ category: existing, message: "Category already exists" }, { status: 200 });
  }

  const category = await prisma.category.create({ data: { name, slug } });
  return NextResponse.json({ category });
}
