"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text">DarkForum</Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition">الرئيسية</Link>
            <Link href="/posts" className="hover:text-primary transition">المواضيع</Link>
            {session ? (
              <>{<Link href="/messages" className="hover:text-primary transition">الرسائل</Link>}<Link href={`/profile/${session.user?.name || 'user'}`} className="hover:text-primary transition">بروفايلي</Link><button onClick={() => signOut()} className="bg-dark-300 hover:bg-dark-400 px-4 py-2 rounded-lg transition">خروج</button></>
            ) : (
              <><Link href="/auth/login" className="hover:text-primary transition">دخول</Link><Link href="/auth/register" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition">تسجيل</Link></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}