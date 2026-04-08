import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-9xl font-extrabold text-blue-100 mb-4 animate-pulse">
        ৪০৪
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
        পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
      </h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        আপনি যে পৃষ্ঠাটি খুঁজছেন তা হয়তো ডিলিট হয়ে গেছে অথবা ইউআরএল (URL) ঠিক নেই।
      </p>
      
      <Link 
        href="/" 
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-transform hover:scale-105"
      >
        <Home size={18} />
        হোম পেজে ফিরে যান
      </Link>
    </div>
  )
}
