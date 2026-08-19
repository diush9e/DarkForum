import prisma from "@/lib/db";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import UploadButton from "@/components/UploadButton";
import { getFiles } from "@/lib/upload";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { id: true, name: true, username: true, image: true } }, comments: true, likes: true },
    orderBy: { createdAt: "desc" }, take: 10,
  });
  const stats = { posts: await prisma.post.count(), users: await prisma.user.count(), comments: await prisma.comment.count() };
  
  // جلب الملفات المرفوعة
  let files: string[] = [];
  try {
    files = await getFiles();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <section className="glass rounded-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">مرحباً بك في DarkForum</h1>
          <p className="text-gray-400 mb-6">منصة النقاشات الحديثة بتصميم داكن احترافي</p>
          
          {/* زر رفع الملفات */}
          <div className="mb-6">
            <UploadButton />
          </div>
          
          <Link href="/auth/register" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold transition-all inline-block">انضم الآن</Link>
        </section>

        {/* عرض الملفات المرفوعة */}
        {files.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">الملفات المرفوعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.slice(0, 6).map((url, index) => {
                const fileName = url.split('/').pop();
                const isImage = fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                const isVideo = fileName?.match(/\.(mp4|webm|ogg)$/i);
                
                return (
                  <div key={index} className="glass rounded-xl p-4">
                    {isImage ? (
                      <img src={url} alt={fileName || ''} className="w-full h-40 object-cover rounded-lg mb-2" />
                    ) : isVideo ? (
                      <video src={url} controls className="w-full h-40 rounded-lg mb-2" />
                    ) : (
                      <div className="w-full h-40 bg-dark-300 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">📄</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-400 truncate">{fileName}</p>
                    <a href={url} target="_blank" className="text-primary text-sm hover:underline">
                      عرض
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="grid grid-cols-3 gap-4">
          <div className="glass rounded-xl p-6 text-center"><div className="text-3xl font-bold text-primary">{stats.posts}</div><div className="text-gray-400">موضوع</div></div>
          <div className="glass rounded-xl p-6 text-center"><div className="text-3xl font-bold text-primary">{stats.users}</div><div className="text-gray-400">مستخدم</div></div>
          <div className="glass rounded-xl p-6 text-center"><div className="text-3xl font-bold text-primary">{stats.comments}</div><div className="text-gray-400">تعليق</div></div>
        </section>
        <section><h2 className="text-2xl font-bold mb-4">آخر المواضيع</h2><div className="space-y-4">{posts.map((post) => (<PostCard key={post.id} post={post} />))}</div></section>
      </div>
      <div className="lg:col-span-1"><Sidebar /></div>
    </div>
  );
}