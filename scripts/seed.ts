import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

async function ensureUniqueBusinessSlug(base: string) {
  let slug = base || crypto.randomUUID();
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.business.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${suffix++}`;
  }
}

async function main() {
  const userEmail = "saikat@gmail.com";
  const userName = "saikat";
  const defaultPassword = "saikat";

  const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
  const passwordHash = existingUser?.password || (await hash(defaultPassword, 10));

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      name: userName,
      ...(existingUser?.password ? {} : { password: passwordHash }),
    },
    create: {
      name: userName,
      email: userEmail,
      password: passwordHash,
    },
  });

  const categoryNames = [
    "Cat food",
    "Food",
    "Clothing",
    "Baby toys",
    "Health",
    "Technology",
    "Energy",
    "Arts & Culture",
  ];

  const categoryMap = new Map<string, string>();
  for (const name of categoryNames) {
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, createdById: user.id },
    });
    categoryMap.set(slug, category.id);
  }

  const businesses = [
    {
      name: "Whisker Bites",
      description: "Premium cat treats and nutrition essentials.",
      comment: "Healthy bites for happy cats.",
      categorySlug: "cat-food",
      pageLink: "https://whiskerbites.example.com",
      instagramUrl: "https://instagram.com/whiskerbites",
      websiteUrl: "https://whiskerbites.example.com",
    },
    {
      name: "Cafe Aurora",
      description: "Neighborhood cafe with specialty coffee and brunch.",
      comment: "Sunlit seats, slow mornings.",
      categorySlug: "food",
      pageLink: "https://cafearora.example.com",
      instagramUrl: "https://instagram.com/cafearora",
      websiteUrl: "https://cafearora.example.com",
    },
    {
      name: "Tiny Trail Toys",
      description: "Playful, durable toys for babies and toddlers.",
      comment: "Designed to grow with little explorers.",
      categorySlug: "baby-toys",
      pageLink: "https://tinytrailtoys.example.com",
      instagramUrl: "https://instagram.com/tinytrailtoys",
      websiteUrl: "https://tinytrailtoys.example.com",
    },
    {
      name: "PulseFit Health",
      description: "Boutique fitness and wellness studio.",
      comment: "Personalized plans, community vibes.",
      categorySlug: "health",
      pageLink: "https://pulsefit.example.com",
      instagramUrl: "https://instagram.com/pulsefit",
      websiteUrl: "https://pulsefit.example.com",
    },
  ];

  for (const biz of businesses) {
    const baseSlug = slugify(biz.name);
    const existing = await prisma.business.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? baseSlug : await ensureUniqueBusinessSlug(baseSlug);
    const categoryId = categoryMap.get(biz.categorySlug);

    await prisma.business.upsert({
      where: { slug },
      update: {
        name: biz.name,
        description: biz.description,
        comment: biz.comment,
        categoryId,
        pageLink: biz.pageLink,
        instagramUrl: biz.instagramUrl,
        websiteUrl: biz.websiteUrl,
        ownerId: user.id,
        isPublic: true,
      },
      create: {
        name: biz.name,
        slug,
        description: biz.description,
        comment: biz.comment,
        categoryId,
        pageLink: biz.pageLink,
        instagramUrl: biz.instagramUrl,
        websiteUrl: biz.websiteUrl,
        ownerId: user.id,
        isPublic: true,
      },
    });
  }

  console.log("Seed complete: user, categories, and businesses ensured.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
