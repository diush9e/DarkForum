"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (title.trim().length < 5) {
      setError("عنوان الموضوع يجب أن يكون 5 أحرف أو أكثر");
      return;
    }

    if (content.trim().length < 10) {
      setError("محتوى الموضوع يجب أن يكون 10 أحرف أو أكثر");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "تعذر إنشاء الموضوع");
        return;
      }

      router.push(`/posts/${data.id}`);
      router.refresh();
    } catch {
      setError("حدث خطأ بالاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">إنشاء موضوع جديد</h1>
          <p className="text-gray-400 mt-2">
            ابدأ نقاشًا جديدًا مع أعضاء المنتدى.
          </p>
        </div>

        <Link
          href="/posts"
          className="text-gray-300 hover:text-primary transition"
        >
          رجوع إلى المواضيع
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 md:p-8 space-y-6"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block font-semibold mb-2">
            عنوان الموضوع
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="مثال: ما رأيكم بأفضل أدوات البرمجة؟"
            maxLength={120}
            required
            className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition"
          />

          <p className="text-xs text-gray-500 mt-2">
            {title.length}/120 حرف
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block font-semibold mb-2">
            محتوى الموضوع
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="اكتب تفاصيل موضوعك هنا..."
            rows={10}
            required
            className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition resize-y"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "جاري النشر..." : "نشر الموضوع"}
          </button>

          <Link
            href="/posts"
            className="bg-dark-300 hover:bg-dark-400 px-6 py-3 rounded-lg font-semibold transition"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}