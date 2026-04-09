import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { submitComment } from "@/app/actions/ideaActions"
import { Send } from "lucide-react"
import ReactionButton from "@/components/shared/ReactionButton"

export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  if (!id) return notFound()
  
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
      reactions: true,
      _count: { select: { reactions: true, comments: true } },
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!idea) return notFound()
  
  const hasReacted = idea.reactions.some(r => r.userId === session?.user?.id)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Idea Details */}
      <article className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-full">
            {idea.category.name}
          </div>

          <ReactionButton
            ideaId={idea.id}
            initialHasReacted={hasReacted}
            initialReactionCount={idea._count.reactions}
          />
        </div>

        {idea.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={idea.logoUrl} alt={idea.title || 'Brand'} className="w-full max-h-80 object-cover rounded-2xl mb-6 shadow-sm" />
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
          {idea.title}
        </h1>
        
        <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
          {idea.description || "কোনো বর্ণনা দেওয়া নেই।"}
        </p>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
          {idea.author.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={idea.author.image} alt={idea.author.name || ''} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
          )}
          <div>
            <p className="font-bold text-slate-900">{idea.author.name}</p>
            <p className="text-xs text-slate-500">{new Date(idea.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          মতামত <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{idea._count.comments}</span>
        </h3>
        
        {session?.user ? (
          <form action={async (fd) => {
            "use server"
            const text = fd.get("text")?.toString()
            if (text) await submitComment(idea.id, text)
          }} className="mb-8 relative">
            <textarea 
              name="text" 
              required
              placeholder="আপনার গঠনমূলক মতামত শেয়ার করুন..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-16 min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow"
            />
            <button type="submit" className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-md">
              <Send size={18} />
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 text-slate-600 p-4 rounded-2xl mb-8 text-center text-sm border border-slate-100">
            মতামত জানাতে <a href={`/login?callbackUrl=/idea/${idea.id}`} className="text-blue-600 font-bold hover:underline">লগইন</a> করুন।
          </div>
        )}

        <div className="space-y-6">
          {idea.comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {comment.author.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={comment.author.image} alt={comment.author.name || ''} className="w-10 h-10 rounded-full flex-shrink-0" />
              )}
              <div className="flex-grow">
                <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4">
                  <p className="font-bold text-slate-900 text-sm mb-1">{comment.author.name}</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{comment.text}</p>
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-2">
                  {new Date(comment.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
          {idea.comments.length === 0 && (
            <p className="text-center text-slate-500 py-4">এখনো কোনো মতামত নেই। প্রথমে মতামত জানান!</p>
          )}
        </div>
      </section>
    </div>
  )
}
