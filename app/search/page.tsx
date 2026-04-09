import Link from "next/link"
import { Search, MessageSquare, Heart } from "lucide-react"
import { searchIdeas } from "@/app/actions/ideaActions"
import { auth } from "@/lib/auth"

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await auth()
  const resolvedSearchParams = await searchParams
  const q = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? ""
    : resolvedSearchParams.q ?? ""
  const query = q.trim()

  const ideas = query ? await searchIdeas(query) : []

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          <span className="text-blue-600">সার্চ</span> আইডিয়া
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          টাইটেল, বর্ণনা, ক্যাটেগরি বা লেখকের নাম দিয়ে আইডিয়া খুঁজুন।
        </p>

        <form action="/search" method="GET" className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 items-center flex">
            <Search size={18} className="absolute pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="যেমন: e-commerce, fintech, logo"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            সার্চ করুন
          </button>
        </form>
      </section>

      {!query ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          সার্চ শুরু করতে উপরে একটি কীওয়ার্ড লিখুন।
        </section>
      ) : ideas.length === 0 ? (
        <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">&quot;{query}&quot; এর জন্য কিছু পাওয়া যায়নি</p>
          <p className="mt-2 text-sm text-slate-500">অন্য কীওয়ার্ড দিয়ে আবার চেষ্টা করুন।</p>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">{ideas.length}</span> টি ফলাফল পাওয়া গেছে
            </p>
            <Link href="/ideas" className="text-sm font-semibold text-blue-600 hover:underline">
              সব আইডিয়া দেখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <article
                key={idea.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {idea.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={idea.logoUrl} alt={idea.title || "Logo"} className="mb-4 h-32 w-full rounded-xl object-cover" />
                )}

                <div className="mb-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {idea.category.name}
                </div>

                <h2 className="mb-2 text-lg font-bold text-slate-900">
                  {idea.title || "নামবিহীন আইডিয়া"}
                </h2>

                {idea.description && (
                  <p className="mb-4 line-clamp-3 text-sm text-slate-600">{idea.description}</p>
                )}

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Heart
                        size={18}
                        className={
                          idea.reactions.some((r) => r.userId === session?.user?.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }
                      />
                      <span className="text-sm font-medium">{idea._count.reactions}</span>
                    </span>

                    <Link href={`/idea/${idea.id}`} className="flex items-center gap-1.5 hover:text-blue-600 transition">
                      <MessageSquare size={18} />
                      <span className="text-sm font-medium">{idea._count.comments}</span>
                    </Link>
                  </div>

                  {idea.author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={idea.author.image}
                      alt={idea.author.name || ""}
                      title={idea.author.name || ""}
                      className="h-7 w-7 rounded-full"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">
                      {idea.author.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>

                <Link
                  href={`/idea/${idea.id}`}
                  className="mt-4 block rounded-xl bg-blue-50 py-2.5 text-center text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                >
                  বিস্তারিত পড়ুন
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
