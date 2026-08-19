import prisma from "@/lib/db";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      role: true,
      isBanned: true,
      banReason: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-primary font-semibold mb-1">
            لوحة الأدمن / المستخدمون
          </p>

          <h1 className="text-3xl font-bold">
            إدارة المستخدمين
          </h1>

          <p className="text-gray-400 mt-2">
            إجمالي المستخدمين: {users.length}
          </p>
        </div>

        <Link
          href="/admin"
          className="bg-dark-300 hover:bg-dark-400 px-5 py-3 rounded-lg font-semibold transition text-center"
        >
          رجوع للوحة الأدمن
        </Link>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-dark-300 border-b border-dark-400">
              <tr>
                <th className="p-4 font-semibold">المستخدم</th>
                <th className="p-4 font-semibold">الدور</th>
                <th className="p-4 font-semibold">المحتوى</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold">تاريخ الانضمام</th>
                <th className="p-4 font-semibold">إجراء</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-400">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-400"
                  >
                    لا يوجد مستخدمون بعد.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-dark-300/50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark-300 border border-dark-400 overflow-hidden flex items-center justify-center shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-bold text-primary">
                              {user.username[0].toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {user.name || user.username}
                          </p>

                          <p className="text-sm text-gray-400 truncate">
                            @{user.username}
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/20 text-purple-300"
                            : user.role === "MODERATOR"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-dark-300 text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-300">
                      <p>📝 {user._count.posts} موضوع</p>
                      <p className="mt-1">💬 {user._count.comments} تعليق</p>
                    </td>

                    <td className="p-4">
                      {user.isBanned ? (
                        <div>
                          <span className="inline-flex bg-red-500/20 text-red-300 rounded-full px-3 py-1 text-xs font-semibold">
                            محظور
                          </span>

                          {user.banReason && (
                            <p className="text-xs text-gray-500 mt-2 max-w-32">
                              {user.banReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex bg-green-500/20 text-green-300 rounded-full px-3 py-1 text-xs font-semibold">
                          نشط
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                      {user.createdAt.toLocaleDateString("ar-EG")}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/profile/${user.username}`}
                        className="text-primary hover:text-primary-light text-sm font-semibold transition"
                      >
                        عرض البروفايل
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}