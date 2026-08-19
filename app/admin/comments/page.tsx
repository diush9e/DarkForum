import prisma from "@/lib/db";
import Link from "next/link";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
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
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-primary font-semibold mb-1">
            لوحة الأدمن / التعليقات
          </p>

          <h1 className="text-3xl font-bold">
            الإشراف على التعليقات
          </h1>

          <p className="text-gray-400 mt-2">
            إجمالي التعليقات: {comments.length}
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
        {comments.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">💬</div>

            <h2 className="text-xl font-bold mb-2">
              لا توجد تعليقات بعد
            </h2>

            <p className="text-gray-400">
              عند وجود تعليقات من الأعضاء ستظهر هنا.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="glass rounded-2xl p-6 hover:border-primary/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-dark-300 overflow-hidden flex items-center justify-center shrink-0">
                      {comment.author.image ? (
                        <img
                          src={comment.author.image}
                          alt={comment.author.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-primary">
                          {comment.author.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {comment.author.name || comment.author.username}
                      </p>

                      <p className="text-sm text-gray-400">
                        @{comment.author.username}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 leading-relaxed">
                    {comment.content}
                  </p>

                  <p className="text-sm text-gray-500 mt-4">
                    نُشر في:{" "}
                    <Link
                      href={`/posts/${comment.post.id}`}
                      className="text-primary hover:underline"
                    >
                      {comment.post.title}
                    </Link>
                  </p>
                </div>

                <div className="text-sm text-gray-500 shrink-0">
                  {comment.createdAt.toLocaleDateString("ar-EG")}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}