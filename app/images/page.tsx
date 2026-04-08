import { prisma } from "@/lib/prisma"

export default async function ImagesPage() {
  let ideasWithLogos = []

  try {
    ideasWithLogos = await prisma.idea.findMany({
      where: { logoUrl: { not: null } },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error("Error fetching ideas with logos:", error)
    return <p className="text-center text-red-500 py-12">লোগো সহ আইডিয়া লোড করতে সমস্যা হয়েছে।</p>
  }

  return (
    <div className="space-y-12">
      <div className="text-center py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl border border-white">
        <h1 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">ব্র্যান্ড <span className="text-purple-600">লোগো গ্যালারি</span></h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          কমিউনিটির উদ্ভাবনী আইডিয়া এবং স্টার্টআপগুলোর অনুপ্রেরণামূলক লোগো কালেকশন।
        </p>
      </div>

      {ideasWithLogos.length === 0 ? (
        <p className="text-center text-slate-500 py-12">এখনো কোনো লোগো আপলোড করা হয়নি।</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ideasWithLogos.map((idea) => (
            <div key={idea.id} className="group relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={idea.logoUrl!} 
                alt={idea.title || 'Logo'} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-purple-300 mb-1">
                  {idea.category.name}
                </span>
                <p className="text-white font-bold leading-tight line-clamp-2 mb-2">
                  {idea.title}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-white/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={idea.author.image || ''} alt={idea.author.name || ''} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white/80 text-xs truncate">{idea.author.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
