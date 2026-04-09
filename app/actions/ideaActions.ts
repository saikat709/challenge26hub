"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { isDbConnectionError } from "@/utils/errorUtils"


export async function getIdeas() {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        category: true,
        author: true,
        _count: {
          select: { reactions: true, comments: true }
        },
        reactions: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return ideas
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.error("Database connection error while fetching ideas", error)
      return []
    }

    console.error("Unexpected error while fetching ideas", error)
    return []
  }
}

export async function searchIdeas(query: string) {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return []

  try {
    const ideas = await prisma.idea.findMany({
      where: {
        OR: [
          {
            title: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: trimmedQuery,
                mode: "insensitive",
              },
            },
          },
          {
            author: {
              name: {
                contains: trimmedQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        category: true,
        author: true,
        _count: {
          select: { reactions: true, comments: true },
        },
        reactions: true,
      },
      orderBy: { createdAt: "desc" },
      take: 36,
    })

    return ideas
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.error("Database connection error while searching ideas", error)
      return []
    }

    console.error("Unexpected error while searching ideas", error)
    return []
  }
}

export async function toggleReaction(ideaId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("লগইন করা প্রয়োজন (Login required)")
  
  const userId = session.user.id
  
  const existing = await prisma.reaction.findUnique({
    where: {
      userId_ideaId: { userId, ideaId }
    }
  })

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } })
  } else {
    await prisma.reaction.create({ data: { userId, ideaId } })
  }
  
  // revalidatePath('/')
  // revalidatePath('/ideas')
  // revalidatePath(`/idea/${ideaId}`)
}

export async function createCategory(name: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("লগইন করা প্রয়োজন (Login required)")

  const category = await prisma.category.create({
    data: { name, addedById: session.user.id }
  })
  
  revalidatePath('/')
  return category
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } })
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.error("Database connection error while fetching categories", error)
      return []
    }

    console.error("Unexpected error while fetching categories", error)
    return []
  }
}
export async function submitIdea(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("লগইন করা প্রয়োজন (Login required)")

  const title = formData.get("title")?.toString() || ""
  const description = formData.get("description")?.toString() || ""
  const categoryId = formData.get("categoryId")?.toString() || ""
  const logoUrl = formData.get("logoUrl")?.toString() || null

  if (!title || !categoryId) {
    throw new Error("ক্যাটেগরি এবং টাইটেল আবশ্যক")
  }

  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      categoryId,
      logoUrl,
      authorId: session.user.id
    }
  })
  
  revalidatePath('/')
  revalidatePath('/ideas')
  return idea
}

export async function submitComment(ideaId: string, text: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("লগইন করা প্রয়োজন")

  if (!text.trim()) throw new Error("কমেন্ট ফাঁকা রাখা যাবে না")

  const comment = await prisma.comment.create({
    data: {
      text,
      ideaId,
      authorId: session.user.id
    }
  })
  
  revalidatePath(`/idea/${ideaId}`)
  return comment
}
