import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4">الصفحة غير موجودة</h1>
      <p className="text-lg mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
      <Link href="/ar" className="text-blue-600 underline">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  )
}
