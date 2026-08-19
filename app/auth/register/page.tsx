"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); setLoading(false); return; }
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: formData.get("username"), email: formData.get("email"), password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "حدث خطأ"); } else { await signIn("credentials", { email: formData.get("email"), password, redirect: false }); router.push("/"); router.refresh(); }
    } catch (err) { setError("حدث خطأ، حاول مرة أخرى"); } finally { setLoading(false); }
  }
  return (
    <div className="max-w-md mx-auto">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">إنشاء حساب جديد</h1>
        <p className="text-gray-400 text-center mb-8">انضم إلى مجتمع DarkForum</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (<div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">{error}</div>)}
          <div><label className="block text-sm font-medium mb-2">اسم المستخدم</label><input type="text" name="username" required className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="@username" /></div>
          <div><label className="block text-sm font-medium mb-2">البريد الإلكتروني</label><input type="email" name="email" required className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="example@email.com" /></div>
          <div><label className="block text-sm font-medium mb-2">كلمة المرور</label><input type="password" name="password" required minLength={8} className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="••••••••" /></div>
          <div><label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" required minLength={8} className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition" placeholder="••••••••" /></div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition">{loading ? "جاري الإنشاء..." : "إنشاء حساب"}</button>
        </form>
        <div className="mt-6 text-center"><p className="text-gray-400">لديك حساب بالفعل؟ <Link href="/auth/login" className="text-primary hover:underline">تسجيل الدخول</Link></p></div>
      </div>
    </div>
  );
}
