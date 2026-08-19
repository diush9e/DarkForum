"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session, status, router]);

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");
    setMessage("");

    if (!selectedFile.type.startsWith("image/")) {
      setError("اختر ملف صورة فقط");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "تعذر رفع الصورة");
        return;
      }

      setImage(data.url);
      setMessage("تم رفع الصورة. اضغط حفظ التعديلات لتثبيتها.");
    } catch {
      setError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          bio,
          image: image || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "تعذر حفظ التعديلات");
        return;
      }

      await update({
        name: data.name,
        image: data.image,
      });

      setMessage("تم حفظ البروفايل بنجاح ✅");

      setTimeout(() => {
        router.push(`/profile/${data.username}`);
        router.refresh();
      }, 900);
    } catch {
      setError("حدث خطأ بالاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-400">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">تعديل البروفايل</h1>

          <p className="text-gray-400 mt-2">
            اضغط على الصورة لاختيار صورة من جهازك.
          </p>
        </div>

        <Link
          href="/"
          className="text-gray-300 hover:text-primary transition"
        >
          رجوع للرئيسية
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 md:p-8 space-y-6"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-4 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-300 p-4 rounded-lg">
            {message}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-28 h-28 rounded-full bg-dark-300 border-2 border-primary overflow-hidden flex items-center justify-center group disabled:opacity-60"
            title="اضغط لاختيار صورة من جهازك"
          >
            {image ? (
              <img
                src={image}
                alt="صورة البروفايل"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-primary">
                {(session?.user as any)?.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}

            <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-semibold transition">
              {uploading ? "جاري الرفع..." : "غيّر الصورة"}
            </span>
          </button>

          <p className="text-sm text-gray-400">
            اضغط على الصورة واخترها من سطح المكتب أو جهازك.
          </p>

          <p className="text-xs text-gray-500">
            JPG أو PNG أو WEBP — الحد الأقصى 2MB.
          </p>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            الاسم الظاهر
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="اكتب اسمك"
            maxLength={50}
            className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            نبذة عنك (Bio)
          </label>

          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="اكتب نبذة قصيرة عنك..."
            maxLength={300}
            rows={5}
            className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition resize-y"
          />

          <p className="text-xs text-gray-500 mt-2">
            {bio.length}/300 حرف
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>

          <Link
            href="/"
            className="bg-dark-300 hover:bg-dark-400 px-6 py-3 rounded-lg font-semibold transition"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}