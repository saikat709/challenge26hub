import GoogleLoginCard from "@/components/auth/GoogleLoginCard"

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl = searchParams?.callbackUrl || "/"

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center py-8 md:py-14">
      <section className="w-full text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">বাংলা মেকার কমিউনিটি</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
          লগইন করুন এবং আপনার আইডিয়া শেয়ার করুন
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          CH26Hub এ লগইন করলে আপনি আইডিয়া পোস্ট, রিয়্যাক্ট, মন্তব্য এবং প্রোফাইল ম্যানেজ করতে পারবেন।
        </p>

        <div className="mx-auto mt-8 max-w-md">
          <GoogleLoginCard callbackUrl={callbackUrl} />
        </div>
      </section>
    </div>
  )
}
