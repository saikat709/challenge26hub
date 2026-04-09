import { getIdeas } from "@/app/actions/ideaActions"
import Link from "next/link"
import { MessageSquare, Heart } from "lucide-react"
import { auth } from "@/lib/auth"


export default async function IdeasPage() {
  const ideas = await getIdeas()
  const session = await auth()

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">সব <span className="text-blue-600">আইডিয়া</span></h1>
          <p className="text-slate-500 mt-2">কমিউনিটির শেয়ার করা সকল আইডিয়াগুলো এখান থেকে এক্সপ্লোর করুন।</p>
        </div>
        <Link href="/new" className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow hover:bg-slate-800 transition">
          + নতুন আইডিয়া
        </Link>
      </div>

      {ideas.length === 0 ? (
        <p className="text-slate-500 text-center py-12 bg-white rounded-3xl border border-slate-100">এখনো কোনো আইডিয়া নেই।</p>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="break-inside-avoid bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              {idea.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={idea.logoUrl} alt={idea.title || 'Logo'} className="w-full h-40 object-cover rounded-2xl mb-5 border border-slate-50" />
              )}
              
              <div className="inline-block px-3 py-1 bg-slate-50 border border-slate-100 text-xs font-bold rounded-full mb-3 text-slate-600">
                {idea.category.name}
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                {idea.title || "নামবিহীন আইডিয়া"}
              </h2>
              
              {idea.description && (
                <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-4">
                  {idea.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} className={idea.reactions.some(r => r.userId === session?.user?.id) ? "fill-red-500 text-red-500" : ""} />
                    <span className="text-sm font-medium">{idea._count.reactions}</span>
                  </div>
                  <Link href={`/idea/${idea.id}`} className="flex items-center gap-1.5 hover:text-blue-600 transition">
                    <MessageSquare size={18} />
                    <span className="text-sm font-medium">{idea._count.comments}</span>
                  </Link>
                </div>
                
                {idea.author.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={idea.author.image} alt={idea.author.name || ''} title={idea.author.name || ''} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    {idea.author.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              
              <Link href={`/idea/${idea.id}`} className="mt-4 block text-center text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition">
                বিস্তারিত পড়ুন
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
