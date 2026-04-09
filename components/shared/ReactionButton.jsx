'use client'

import { toggleReaction } from "@/app/actions/ideaActions"
import { Heart } from "lucide-react"
import { useState } from "react"

export default function ReactionButton({ ideaId, initialHasReacted, initialReactionCount }) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasReacted, setHasReacted] = useState(initialHasReacted)
  const [reactionCount, setReactionCount] = useState(initialReactionCount)

  const handleClick = async () => {
    if (isLoading) return

    const nextHasReacted = !hasReacted

    setHasReacted(nextHasReacted)
    setReactionCount((prev) => Math.max(0, prev + (nextHasReacted ? 1 : -1)))

    setIsLoading(true)
    try {
      await toggleReaction(ideaId)
    } catch (error) {
      setHasReacted((prev) => !prev)
      setReactionCount((prev) => Math.max(0, prev + (nextHasReacted ? -1 : 1)))
      console.error("Failed to toggle reaction", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
        hasReacted
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <Heart size={20} className={hasReacted ? "fill-red-500" : ""} />
      <span className="font-bold">{isLoading ? "..." : reactionCount}</span>
    </button>
  )
}