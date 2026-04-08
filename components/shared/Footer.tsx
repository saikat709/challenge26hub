import Link from "next/link"

const footerLinks = [
  { href: "/", label: "হোম" },
  { href: "/ideas", label: "আইডিয়া" },
  { href: "/new", label: "নতুন যোগ" },
  { href: "/images", label: "লোগো" },
]

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50/70">
      <div className="container mx-auto max-w-4xl px-4 py-8 lg:max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-700">CH26 Hub</p>
            <p className="mt-1 text-sm text-slate-600">বাংলা আইডিয়া, মেকার মাইন্ডস, কমিউনিটি বিল্ডিং।</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-600 md:justify-end">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-3 py-1.5 transition-colors hover:bg-sky-100 hover:text-sky-800">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500 md:text-left">
          Copyright {new Date().getFullYear()} CH26 Hub. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
