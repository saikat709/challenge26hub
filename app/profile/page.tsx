import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

async function deleteIdea(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) return

  const ideaId = formData.get("ideaId")?.toString()
  if (!ideaId) return

  // Verify ownership
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } })
  if (idea?.authorId === session.user.id) {
    await prisma.idea.delete({ where: { id: ideaId } })
    revalidatePath('/profile')
    revalidatePath('/')
  }
}

async function updateProfile(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) return

  const bio = formData.get("bio")?.toString() || ""
  const name = formData.get("name")?.toString() || ""

  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio, name }
  })
  
  revalidatePath('/profile')
}

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ideas: {
        include: { category: true, _count: { select: { reactions: true, comments: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) return <div>User not found</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Edit Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0 text-center">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name || "User"} className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
          )}
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-red-500 text-sm font-medium hover:text-red-700 transition">
              লগআউট করুন (Logout)
            </button>
          </form>
        </div>

        <form action={updateProfile} className="flex-grow w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">নাম</label>
            <Input name="name" defaultValue={user.name || ""} className="rounded-xl h-12" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ইমেইল (অপরিবর্তনযোগ্য)</label>
            <Input value={user.email || ""} disabled className="rounded-xl h-12 bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">বায়ো (Bio)</label>
            <Textarea name="bio" defaultValue={user.bio || ""} className="rounded-xl" placeholder="আপনার সম্পর্কে কিছু লিখুন..." />
          </div>
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
            প্রোফাইল আপডেট করুন
          </Button>
        </form>
      </section>

      {/* User's Ideas */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">আপনার যোগ করা আইডিয়া সমূহ</h2>
        
        {user.ideas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500 mb-4">আপনি এখনো কোনো আইডিয়া যোগ করেননি।</p>
            <a href="/new" className="text-blue-600 font-medium hover:underline">নতুন আইডিয়া যোগ করুন</a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {user.ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative">
                <div className="inline-block px-3 py-1 bg-slate-100 text-xs font-medium rounded-full mb-3 text-slate-600">
                  {idea.category.name}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{idea.title}</h3>
                <div className="flex items-center justify-between text-slate-500 text-sm border-t border-slate-50 pt-3">
                  <div className="flex gap-4">
                    <span>❤️ {idea._count.reactions}</span>
                    <span>💬 {idea._count.comments}</span>
                  </div>
                  <form action={deleteIdea}>
                    <input type="hidden" name="ideaId" value={idea.id} />
                    <Button type="submit" variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8">
                      মুছুন
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
