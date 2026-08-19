import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { username } = await params;

  // نعرف من هو المستخدم الذي سجّل دخوله الآن
  const session = await auth();

  // نبحث عن صاحب البروفايل الذي تم فتحه
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      posts: {
        include: {
          comments: true,
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // هل هذا بروفايل الشخص المسجل حاليًا؟
  const isMyProfile = session?.user?.id === user.id;

  const stats = {
    posts: user.posts.length,
    followers: 0,
    following: 0,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* غلاف البروفايل */}
      <div className="h-48 bg-gradient-to-r from-primary to-primary-light rounded-t-2xl" />

      {/* بيانات البروفايل */}
      <div className="glass rounded-b-2xl p-6 md:p-8 -mt-16 relative">
        <div className="flex flex-col md:flex-row md:items-end gap-5">
          {/* صورة البروفايل */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-dark-300 border-4 border-dark-200 overflow-hidden shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* الاسم واسم المستخدم */}
          <div className="flex-1 pb-0 md:pb-4">
            <h1 className="text-3xl font-bold mb-2">
              {user.name || user.username}
            </h1>

            <p className="text-gray-400">
              @{user.username}
            </p>
          </div>

          {/* الأزرار تختلف حسب صاحب الحساب */}
          <div className="flex gap-3 md:pb-4">
            {isMyProfile ? (
              <Link
                href="/profile/edit"
                className="bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                تعديل البروفايل
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-lg font-semibold transition"
                >
                  متابعة
                </button>

                <Link
                  href={`/messages?user=${user.username}`}
                  className="bg-dark-300 hover:bg-dark-400 border border-dark-400 px-5 py-3 rounded-lg font-semibold transition"
                >
                  💬 رسالة
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-dark-400">
          <h2 className="font-semibold mb-2">
            نبذة عني
          </h2>

          <p className="text-gray-300 whitespace-pre-line">
            {user.bio || "لم يضف هذا المستخدم نبذة تعريفية بعد."}
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <span className="text-2xl font-bold text-primary">
              {stats.posts}
            </span>

            <span className="text-gray-400 mr-2">
              مشاركة
            </span>
          </div>

          <div>
            <span className="text-2xl font-bold text-primary">
              {stats.followers}
            </span>

            <span className="text-gray-400 mr-2">
              متابع
            </span>
          </div>

          <div>
            <span className="text-2xl font-bold text-primary">
              {stats.following}
            </span>

            <span className="text-gray-400 mr-2">
              يتابع
            </span>
          </div>

          <div className="text-gray-400">
            انضم {formatDate(user.createdAt)}
          </div>
        </div>
      </div>

      {/* مواضيع المستخدم */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          مشاركات {user.username}
        </h2>

        {user.posts.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">📝</div>

            <h3 className="text-xl font-bold mb-2">
              لا توجد مشاركات بعد
            </h3>

            <p className="text-gray-400">
              هذا المستخدم لم ينشر أي موضوع حتى الآن.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block glass rounded-xl p-6 hover:border-primary/50 transition"
              >
                <h3 className="text-xl font-bold mb-2">
                  {post.title}
                </h3>

                <p className="text-gray-400 mb-4">
                  {post.content.length > 150
                    ? `${post.content.slice(0, 150)}...`
                    : post.content}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>💬 {post.comments.length}</span>
                  <span>❤️ {post.likes.length}</span>
                  <span>👁️ {post.views}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}