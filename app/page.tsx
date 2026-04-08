import { getIdeas } from "./actions/ideaActions"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { MessageSquare, Heart } from "lucide-react"

export default async function Home() {
  const ideas = await getIdeas()
  const session = await auth()
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-sm border border-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">আপনার <span className="text-blue-600">আইডিয়া</span> শেয়ার করুন</h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          বাংলা সোশ্যাল প্রোডাক্ট বোর্ড। আপনার নতুন স্টার্টআপ বা প্রজেক্ট আইডিয়া সবার সাথে শেয়ার করুন, মতামত নিন এবং কমিউনিটির সাথে যুক্ত হন।
        </p>
        <Link href="/new" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all inline-flex items-center gap-2">
          নতুন আইডিয়া যোগ করুন
        </Link>
      </section>

      {/* Feed Section (Masonry Grid) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">সর্বশেষ আইডিয়া সমূহ</h2>
          <Link href="/ideas" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            সব আইডিয়া দেখুন
          </Link>
        </div>
        
        {ideas.length === 0 ? (
          <p className="text-slate-500 text-center py-12">এখনও কোনো আইডিয়া নেই। প্রথমে যোগ করুন!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 transform hover:-translate-y-1">
                {idea.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={idea.logoUrl} alt={idea.title || 'Logo'} className="w-full h-32 object-cover rounded-xl mb-4" />
                )}
                
                <div className="inline-block px-3 py-1 bg-slate-100 text-xs font-medium rounded-full mb-3 text-slate-600">
                  {idea.category.name}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {idea.title || "নামবিহীন আইডিয়া"}
                </h3>
                
                {idea.description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {idea.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-500">
                    <button className="flex items-center gap-1 hover:text-red-500 transition">
                      <Heart size={18} className={idea.reactions.some(r => r.userId === session?.user?.id) ? "fill-red-500 text-red-500" : ""} />
                      <span className="text-sm">{idea._count.reactions}</span>
                    </button>
                    <Link href={`/idea/${idea.id}`} className="flex items-center gap-1 hover:text-blue-500 transition ml-4">
                      <MessageSquare size={18} />
                      <span className="text-sm">{idea._count.comments}</span>
                    </Link>
                  </div>
                  
                  {idea.author.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={idea.author.image} alt={idea.author.name || ''} title={idea.author.name || ''} className="w-6 h-6 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">এই প্ল্যাটফর্মটি কি সবার জন্য উন্মুক্ত?</h3>
            <p className="text-slate-600 text-sm">হ্যাঁ, যেকোনো ব্যক্তি তাদের গুগল অ্যাকাউন্ট দিয়ে লগইন করে আইডিয়া শেয়ার এবং মতামত প্রদান করতে পারবেন।</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">ক্যাটেগরি কীভাবে যুক্ত করব?</h3>
            <p className="text-slate-600 text-sm">নতুন আইডিয়া জমা দেওয়ার সময় মেনু থেকে "+ নতুন ক্যাটেগরি" নির্বাচন করে আপনি সহজেই নতুন ক্যাটেগরি যুক্ত করতে পারবেন।</p>
          </div>
        </div>
      </section>
    </div>
  )
}
