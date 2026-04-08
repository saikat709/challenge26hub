"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { submitIdea, createCategory } from "@/app/actions/ideaActions"
import { UploadDropzone } from "@/lib/uploadthing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg">
      {pending ? "যোগ করা হচ্ছে..." : "পোস্ট করুন"}
    </Button>
  )
}

export default function CreateIdeaForm({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [selectedCat, setSelectedCat] = useState<string>("")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [creatingCat, setCreatingCat] = useState(false)

  const handleCategoryChange = (val: string | null) => {
    if (!val) return
    if (val === "NEW_CAT") {
      setIsModalOpen(true)
    } else {
      setSelectedCat(val)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return
    setCreatingCat(true)
    try {
      const cat = await createCategory(newCatName)
      setCategories([...categories, cat])
      setSelectedCat(cat.id)
      setIsModalOpen(false)
      setNewCatName("")
    } catch (e) {
      console.error(e)
      alert("ক্যাটেগরি তৈরিতে সমস্যা হয়েছে।")
    } finally {
      setCreatingCat(false)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    if (!selectedCat) {
      alert("অনুগ্রহ করে একটি ক্যাটেগরি নির্বাচন করুন")
      return
    }
    formData.append("categoryId", selectedCat)
    if (logoUrl) formData.append("logoUrl", logoUrl)

    try {
      await submitIdea(formData)
      router.push("/")
    } catch (e) {
      console.error(e)
      alert("আইডিয়া যোগ করতে সমস্যা হয়েছে।")
    }
  }

  return (
    <>
      <form action={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ক্যাটেগরি *</label>
          <Select value={selectedCat} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full rounded-2xl h-12 bg-slate-50 border-slate-200">
              <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="cursor-pointer">
                  {cat.name}
                </SelectItem>
              ))}
              <SelectItem value="NEW_CAT" className="text-blue-600 font-bold bg-blue-50 mt-2 cursor-pointer focus:bg-blue-100">
                + নতুন ক্যাটেগরি
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">আইডিয়ার নাম *</label>
          <Input name="title" required placeholder="আপনার দুর্দান্ত আইডিয়ার নাম দিন" className="rounded-2xl h-12 bg-slate-50 border-slate-200 px-4" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">বিস্তারিত বর্ণনা (ঐচ্ছিক)</label>
          <Textarea 
            name="description" 
            placeholder="আপনার আইডিয়া বিস্তারিত বর্ণনা করুন..." 
            className="rounded-2xl bg-slate-50 border-slate-200 p-4 min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">লোগো আপলোড (ঐচ্ছিক)</label>
          {logoUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo preview" className="w-full max-h-48 object-cover rounded-2xl border-2 border-dashed border-blue-200" />
              <button 
                type="button" 
                onClick={() => setLogoUrl(null)} 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 text-xs hover:bg-red-600"
              >
                বাতিল করুন
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden custom-uploadthing">
              <UploadDropzone
                endpoint="logoUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setLogoUrl(res[0].url)
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`আপলোডে সমস্যা হয়েছে! ${error.message}`);
                }}
                appearance={{
                  label: "লোগো আপলোড করতে ক্লিক করুন অথবা টেনে আনুন (Max: 4MB)",
                  button: "bg-blue-600 text-white rounded-full px-6 py-2 mt-4 font-medium hover:bg-blue-700 text-sm",
                  allowedContent: "text-slate-400 text-xs mt-2"
                }}
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <SubmitButton />
        </div>
      </form>

      {/* New Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border-0 shadow-2xl inset-0 m-auto h-56">
          <DialogHeader>
            <DialogTitle className="text-xl">নতুন ক্যাটেগরি যোগ করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input 
              value={newCatName} 
              onChange={(e) => setNewCatName(e.target.value)} 
              placeholder="ক্যাটেগরির নাম লিখুন... (যেমন: ফিনটেক)"
              className="rounded-2xl h-12 px-4 shadow-sm"
              autoFocus
            />
            <Button 
              onClick={handleCreateCategory} 
              disabled={creatingCat || !newCatName.trim()} 
              className="w-full rounded-2xl h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {creatingCat ? "যোগ করা হচ্ছে..." : "যোগ করুন"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
