import prisma from "@/lib/db";
import Link from "next/link";

export default async function AdminPage() {
  const totalUsers = await prisma.user.count();

  const totalPosts = await prisma.post.count();

  const totalComments = await prisma.comment.count();

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-primary font-semibold mb-1">
            لوحة التحكم
          </p>

          <h1 className="text-3xl font-bold">
            إدارة DarkForum
          </h1>

          <p className="text-gray-400 mt-2">
            راقب نشاط المنتدى وأدر المستخدمين والمحتوى.
          </p>
        </div>

        <Link
          href="/"
          className="bg-dark-300 hover:bg-dark-400 px-5 py-3 rounded-lg font-semibold transition text-center"
        >
          العودة للموقع
        </Link>
      </div>

      {/* الإحصائيات */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">إجمالي الأعضاء</p>

              <p className="text-4xl font-bold text-primary mt-2">
                {totalUsers}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
              👥
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">إجمالي المواضيع</p>

              <p className="text-4xl font-bold text-primary mt-2">
                {totalPosts}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
              📝
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">إجمالي التعليقات</p>

              <p className="text-4xl font-bold text-primary mt-2">
                {totalComments}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
              💬
            </div>
          </div>
        </div>
      </section>

      {/* اختصارات الإدارة */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <Link
          href="/admin/users"
          className="glass rounded-2xl p-6 hover:border-primary/60 transition group"
        >
          <div className="text-3xl mb-4">👤</div>

          <h2 className="text-xl font-bold group-hover:text-primary transition">
            إدارة المستخدمين
          </h2>

          <p className="text-gray-400 mt-2">
            عرض الأعضاء وتعديل الأدوار والحظر.
          </p>
        </Link>

        <Link
          href="/admin/posts"
          className="glass rounded-2xl p-6 hover:border-primary/60 transition group"
        >
          <div className="text-3xl mb-4">🗂️</div>

          <h2 className="text-xl font-bold group-hover:text-primary transition">
            إدارة المواضيع
          </h2>

          <p className="text-gray-400 mt-2">
            مراجعة وحذف المواضيع المخالفة.
          </p>
        </Link>

        <Link
          href="/admin/comments"
          className="glass rounded-2xl p-6 hover:border-primary/60 transition group"
        >
          <div className="text-3xl mb-4">🛡️</div>

          <h2 className="text-xl font-bold group-hover:text-primary transition">
            الإشراف والتقارير
          </h2>

          <p className="text-gray-400 mt-2">
            مراجعة التعليقات والبلاغات لاحقًا.
          </p>
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث الأعضاء */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-dark-400 flex items-center justify-between">
            <h2 className="text-xl font-bold">أحدث الأعضاء</h2>

            <Link
              href="/admin/users"
              className="text-primary hover:text-primary-light transition text-sm"
            >
              عرض الكل
            </Link>
          </div>

          <div className="divide-y divide-dark-400">
            {recentUsers.length === 0 ? (
              <p className="p-6 text-center text-gray-400">
                لا يوجد أعضاء بعد.
              </p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {user.name || user.username}
                    </p>

                    <p className="text-sm text-gray-400 truncate">
                      @{user.username}
                    </p>
                  </div>

                  <span className="text-xs bg-dark-300 border border-dark-400 rounded-full px-3 py-1">
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* أحدث المواضيع */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-dark-400 flex items-center justify-between">
            <h2 className="text-xl font-bold">أحدث المواضيع</h2>

            <Link
              href="/admin/posts"
              className="text-primary hover:text-primary-light transition text-sm"
            >
              عرض الكل
            </Link>
          </div>

          <div className="divide-y divide-dark-400">
            {recentPosts.length === 0 ? (
              <p className="p-6 text-center text-gray-400">
                لا توجد مواضيع بعد.
              </p>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {post.title}
                    </p>

                    <p className="text-sm text-gray-400">
                      بواسطة @{post.author.username}
                    </p>
                  </div>

                  <Link
                    href={`/posts/${post.id}`}
                    className="text-primary text-sm hover:underline shrink-0"
                  >
                    عرض
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}