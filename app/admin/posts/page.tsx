import prisma from "@/lib/db";
import Link from "next/link";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-primary font-semibold mb-1">
            لوحة الأدمن / المواضيع
          </p>

          <h1 className="text-3xl font-bold">
            إدارة المواضيع
          </h1>

          <p className="text-gray-400 mt-2">
            إجمالي المواضيع: {posts.length}
          </p>
        </div>

        <Link
          href="/admin"
          className="bg-dark-300 hover:bg-dark-400 px-5 py-3 rounded-lg font-semibold transition text-center"
        >
          رجوع للوحة الأدمن
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📝</div>

            <h2 className="text-xl font-bold mb-2">
              لا توجد مواضيع بعد
            </h2>

            <p className="text-gray-400">
              عندما ينشر المستخدمون مواضيع ستظهر هنا.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="glass rounded-2xl p-6 hover:border-primary/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-dark-300 overflow-hidden flex items-center justify-center shrink-0">
                      {post.author.image ? (
                        <img
                          src={post.author.image}
                          alt={post.author.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-primary">
                          {post.author.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {post.author.name || post.author.username}
                      </p>

                      <p className="text-sm text-gray-400">
                        @{post.author.username}
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 leading-relaxed">
                    {post.content.length > 200
                      ? `${post.content.slice(0, 200)}...`
                      : post.content}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <span>💬 {post._count.comments} تعليق</span>
                    <span>❤️ {post._count.likes} إعجاب</span>
                    <span>👁️ {post.views} مشاهدة</span>
                    <span>
                      {post.createdAt.toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  <Link
                    href={`/posts/${post.id}`}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    عرض الموضوع
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}