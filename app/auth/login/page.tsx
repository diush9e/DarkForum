"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const result = await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirect: false });
      if (result?.error) { setError(result.error); } else { router.push("/"); router.refresh(); }
    } catch (err) { setError("حدث خطأ، حاول مرة أخرى"); } finally { setLoading(false); }
  }
  return (
    <div className="max-w-md mx-auto">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">تسجيل الدخول</h1>
        <p className="text-gray-400 text-center mb-8">مرحباً بك مجدداً في DarkForum</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (<div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">{error}</div>)}
          <div><label className="block text-sm font-medium mb-2">البريد الإلكتروني</label><input type="email" name="email" required className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="example@email.com" /></div>
          <div><label className="block text-sm font-medium mb-2">كلمة المرور</label><input type="password" name="password" required className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="••••••••" /></div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition">{loading ? "جاري الدخول..." : "دخول"}</button>
        </form>
        <div className="mt-6 text-center"><p className="text-gray-400">ليس لديك حساب؟ <Link href="/auth/register" className="text-primary hover:underline">إنشاء حساب جديد</Link></p></div>
        <div className="mt-8 pt-6 border-t border-dark-400"><button onClick={() => signIn("github", { callbackUrl: "/" })} className="w-full bg-dark-300 hover:bg-dark-400 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">تسجيل الدخول عبر GitHub</button></div>
      </div>
    </div>
  );
}
