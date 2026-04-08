import { getCategories } from "@/app/actions/ideaActions"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import CreateIdeaForm from "./CreateIdeaForm"

export default async function NewIdeaPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/new")
  }
  
  const initialCategories = await getCategories()

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">নতুন আইডিয়া 💡</h1>
        <p className="text-slate-500 mb-8">আপনার চমৎকার আইডিয়াটি বিস্তারিত লিখুন এবং কমিউনিটির সাথে শেয়ার করুন।</p>
        
        <CreateIdeaForm initialCategories={initialCategories} />
      </div>
    </div>
  )
}
