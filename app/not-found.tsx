import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900">
      <div className="w-full max-w-lg space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-slate-600">
          The page you’re looking for isn’t here. Head back home to continue browsing.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Go home
          </Link>
          <Link href="/businesses" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900">
            View businesses
          </Link>
        </div>
      </div>
    </main>
  );
}
