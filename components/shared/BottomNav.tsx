"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Lightbulb, Image as ImageIcon, User, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoggedIn = mounted && !!session?.user

  const links = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/ideas", label: "আইডিয়া", icon: Lightbulb },
    { href: "/new", label: "নতুন যোগ", icon: PlusCircle, highlight: true },
    { href: "/images", label: "লোগো", icon: ImageIcon },
    {
      href: isLoggedIn ? "/profile" : "/login",
      label: isLoggedIn ? "প্রোফাইল" : "লগইন",
      icon: User,
    },
  ]

  const isRouteActive = (href: string) => {
    if (!mounted) return false
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="md:hidden fixed inset-x-0 bottom-3 z-50 px-3">
      <div className="mx-auto flex max-w-md items-end justify-between rounded-3xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = isRouteActive(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className={cn(
                "relative flex min-w-12 flex-1 flex-col items-center justify-end gap-1 rounded-2xl py-1.5 transition-all duration-200",
                link.highlight
                  ? "-translate-y-2"
                  : isActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-blue-600"
              )}
            >
              {link.highlight ? (
                <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_12px_24px_rgba(37,99,235,0.42)] ring-4 ring-white">
                  <Icon size={24} />
                </span>
              ) : (
                <Icon size={21} className={isActive ? "text-blue-600" : "text-slate-500"} />
              )}
              <span className={cn("text-[10px] font-semibold", link.highlight ? "text-blue-700" : isActive ? "text-blue-600" : "text-slate-500")}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}