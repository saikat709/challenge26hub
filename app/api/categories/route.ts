import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

const defaultCategories = [
  "Cat food",
  "Food",
  "Clothing",
  "Baby toys",
  "Health",
  "Technology",
  "Energy",
  "Arts & Culture",
  "Governance",
];

async function ensureDefaults() {
  const existing = await prisma.category.count();
  if (existing > 0) return;

  await prisma.category.createMany({
    data: defaultCategories.map((name) => ({ name, slug: slugify(name) })),
    skipDuplicates: true,
  });
}

export async function GET() {
  await ensureDefaults();
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
