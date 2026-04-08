import "dotenv/config"
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from './generated/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

type SeedIdea = {
  title: string
  description: string
  logoUrl: string
  categoryName: string
}

const seedIdeas: SeedIdea[] = [
  {
    title: 'বাংলা ভয়েস নোটস অ্যাপ',
    description: 'বাংলায় দ্রুত ভয়েস নোট, অটো ট্রান্সক্রিপশন এবং ট্যাগিং সাপোর্টসহ একটি প্রোডাক্টিভিটি অ্যাপ।',
    logoUrl: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=900&q=80&auto=format&fit=crop',
    categoryName: 'Productivity',
  },
  {
    title: 'লোকাল ফুড মার্কেটপ্লেস',
    description: 'স্থানীয় হোম-কুকড খাবার অর্ডার, রেটিং এবং ডেলিভারি ট্র্যাকিংসহ কমিউনিটি-ভিত্তিক প্ল্যাটফর্ম।',
    logoUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=80&auto=format&fit=crop',
    categoryName: 'FoodTech',
  },
  {
    title: 'স্টাডি স্প্রিন্ট ক্লাব',
    description: 'শিক্ষার্থীদের জন্য টাইমড স্টাডি স্প্রিন্ট, গ্রুপ চ্যালেঞ্জ এবং প্রগ্রেস অ্যানালিটিক্স।',
    logoUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=80&auto=format&fit=crop',
    categoryName: 'EdTech',
  },
  {
    title: 'মাইক্রো সেলার টুলকিট',
    description: 'ছোট ব্যবসায়ীদের জন্য ইনভেন্টরি, অর্ডার এবং WhatsApp ভিত্তিক কাস্টমার ফলো-আপ টুল।',
    logoUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=80&auto=format&fit=crop',
    categoryName: 'Commerce',
  },
]

async function main() {
  console.log('Seeding database...')

  // ১) টেস্ট ইউজার
  const author = await prisma.user.upsert({
    where: { email: 'test@ch26hub.local' },
    update: {
      name: 'সৈকত (Test User)',
      bio: 'আমি কোডিং করতে ভালোবাসি এবং নতুন আইডিয়া শেয়ার করতে পছন্দ করি।',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    create: {
      name: 'সৈকত (Test User)',
      email: 'test@ch26hub.local',
      bio: 'আমি কোডিং করতে ভালোবাসি এবং নতুন আইডিয়া শেয়ার করতে পছন্দ করি।',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  })

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@ch26hub.local' },
    update: {
      name: 'রিভিউয়ার (Demo User)',
      bio: 'আমি নতুন প্রোডাক্ট আইডিয়ায় গঠনমূলক ফিডব্যাক দিই।',
      image: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
    create: {
      name: 'রিভিউয়ার (Demo User)',
      email: 'reviewer@ch26hub.local',
      bio: 'আমি নতুন প্রোডাক্ট আইডিয়ায় গঠনমূলক ফিডব্যাক দিই।',
      image: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
  })

  // ২) ক্যাটেগরি (unique name হওয়ায় upsert)
  const categoryMap = new Map<string, string>()
  const categoryNames = [...new Set(seedIdeas.map((idea) => idea.categoryName))]

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        addedById: author.id,
      },
    })
    categoryMap.set(name, category.id)
  }

  // ৩) আইডিয়া ডুপ্লিকেট এড়াতে পুরনো demo data সরিয়ে আবার তৈরি
  await prisma.idea.deleteMany({ where: { authorId: author.id } })

  const createdIdeas = []
  for (const item of seedIdeas) {
    const categoryId = categoryMap.get(item.categoryName)
    if (!categoryId) continue

    const idea = await prisma.idea.create({
      data: {
        title: item.title,
        description: item.description,
        logoUrl: item.logoUrl,
        authorId: author.id,
        categoryId,
      },
    })
    createdIdeas.push(idea)
  }

  // ৪) কয়েকটি কমেন্ট + রিয়্যাকশন
  if (createdIdeas.length > 0) {
    await prisma.comment.createMany({
      data: [
        {
          ideaId: createdIdeas[0].id,
          authorId: reviewer.id,
          text: 'দারুণ আইডিয়া। বাংলা ভয়েস ইনপুট অপশন থাকলে ইউজার গ্রোথ দ্রুত হবে।',
        },
        {
          ideaId: createdIdeas[1]?.id || createdIdeas[0].id,
          authorId: reviewer.id,
          text: 'লোকাল ভেন্ডর অনবোর্ডিং ফ্লোটা সহজ করলে দ্রুত স্কেল করতে পারবেন।',
        },
      ],
    })

    await prisma.reaction.createMany({
      data: createdIdeas.slice(0, 3).flatMap((idea) => [
        { ideaId: idea.id, userId: author.id },
        { ideaId: idea.id, userId: reviewer.id },
      ]),
      skipDuplicates: true,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`Users: 2, Categories: ${categoryNames.length}, Ideas: ${createdIdeas.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())