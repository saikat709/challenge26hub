"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const baseNavItems = [
  { href: "/", label: "হোম" },
  { href: "/ideas", label: "আইডিয়া" },
  { href: "/new", label: "নতুন যোগ" },
  { href: "/images", label: "লোগো গ্যালারি" },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoggedIn = mounted && !!session?.user

  const navItems = baseNavItems

  const isRouteActive = (href: string) => {
    if (!mounted) return false
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto max-w-4xl px-4 py-3 lg:max-w-6xl">
        <div className="flex items-center gap-3 md:gap-4 w-full">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-105">
              <Image 
                src="/idea.png" 
                alt="Idea logo" 
                width={34} 
                height={34} 
                className="h-9 w-9 object-cover" priority />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-slate-900">CH26 Hub</span>
              <span className="hidden text-[11px] font-medium text-sky-700 sm:block">Bangla Idea Community</span>
            </span>
          </Link>

          <div className="flex-1"></div>

          <nav className="flex-1 items-center justify-center gap-1 overflow-x-auto lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition-colors lg:text-md",
                  isRouteActive(item.href)
                    ? "bg-sky-100 text-sky-800"
                    : "text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {isLoggedIn ? (
              <form action="/api/auth/signout" method="POST">
                <input type="hidden" name="callbackUrl" value="/" />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  লগআউট
                </button>
              </form>
            ) : (
              <Link href="/login" className="whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                লগইন
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
