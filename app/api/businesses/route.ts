import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

async function ensureSlugUnique(base: string) {
  let slug = base;
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.business.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${suffix++}`;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const categoryId = searchParams.get("categoryId") || undefined;

  const businesses = await prisma.business.findMany({
    where: {
      isPublic: true,
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      owner: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ businesses });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    name,
    description,
    comment,
    categoryId,
    newCategoryName,
    logoUrl,
    logoKey,
    coverUrl,
    coverKey,
    pageLink,
    instagramUrl,
    websiteUrl,
  } = body as Record<string, string | undefined>;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  let finalCategoryId = categoryId || undefined;
  if (!finalCategoryId && newCategoryName) {
    const slug = slugify(newCategoryName);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: newCategoryName,
        slug,
        createdById: session.user.id,
      },
    });
    finalCategoryId = category.id;
  }

  const baseSlug = slugify(name);
  const slug = await ensureSlugUnique(baseSlug || crypto.randomUUID());

  const business = await prisma.business.create({
    data: {
      name,
      slug,
      description,
      comment,
      categoryId: finalCategoryId,
      ownerId: session.user.id,
      logoUrl,
      logoKey,
      coverUrl,
      coverKey,
      pageLink,
      instagramUrl,
      websiteUrl,
      isPublic: true,
    },
    include: {
      category: true,
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ business });
}
