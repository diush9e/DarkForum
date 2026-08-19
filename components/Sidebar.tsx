import prisma from "@/lib/db";
import Link from "next/link";
export default async function Sidebar() {
  const topUsers = await prisma.user.findMany({ include: { posts: true }, orderBy: { createdAt: "desc" }, take: 5 });
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6"><h3 className="text-lg font-bold mb-4">مشاركة جديدة</h3><Link href="/posts/new" className="block w-full bg-primary hover:bg-primary-hover text-white text-center py-3 rounded-lg font-semibold transition">+ موضوع جديد</Link></div>
      <div className="glass rounded-xl p-6"><h3 className="text-lg font-bold mb-4">🔥 مواضيع شائعة</h3><ul className="space-y-3"><li><Link href="#" className="text-gray-400 hover:text-primary transition">#تقنية</Link></li><li><Link href="#" className="text-gray-400 hover:text-primary transition">#برمجة</Link></li><li><Link href="#" className="text-gray-400 hover:text-primary transition">#تصميم</Link></li></ul></div>
      <div className="glass rounded-xl p-6"><h3 className="text-lg font-bold mb-4">👥 مستخدمون نشطون</h3><ul className="space-y-3">{topUsers.map((user) => (<li key={user.id}><Link href={`/profile/${user.username}`} className="flex items-center gap-3 hover:text-primary transition"><div className="w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center">{user.image ? (<img src={user.image} alt={user.name || user.username} className="w-full h-full rounded-full object-cover" />) : (<span className="text-sm font-bold">{user.username[0].toUpperCase()}</span>)}</div><span>{user.username}</span></Link></li>))}</ul></div>
    </div>
  );
}
