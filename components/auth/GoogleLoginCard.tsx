"use client"

import { signIn } from "next-auth/react"
import { LogIn, ArrowRight } from "lucide-react"

type GoogleLoginCardProps = {
  callbackUrl: string
}

export default function GoogleLoginCard({ callbackUrl }: GoogleLoginCardProps) {
  return (
    <div className="rounded-2xl bg-white/70 p-2">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <LogIn size={18} />
        Google দিয়ে লগইন করুন
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
