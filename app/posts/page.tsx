import prisma from "@/lib/db";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      comments: true,
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">كل المواضيع</h1>
          <p className="text-gray-400 mt-2">
            اكتشف آخر نقاشات مجتمع DarkForum
          </p>
        </div>

        <Link
          href="/posts/new"
          className="bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + موضوع جديد
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">لا توجد مواضيع بعد</h2>
          <p className="text-gray-400 mb-6">
            كن أول شخص ينشئ موضوعًا في المنتدى.
          </p>

          <Link
            href="/posts/new"
            className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            إنشاء أول موضوع
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}