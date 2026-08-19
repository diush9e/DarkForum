import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "اختر صورة أولًا" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        { error: "اختر صورة JPG أو PNG أو WEBP فقط" },
        { status: 400 }
      );
    }

    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم الصورة يجب أن يكون أقل من 2MB" },
        { status: 400 }
      );
    }

    const extension =
      image.type === "image/png"
        ? "png"
        : image.type === "image/webp"
          ? "webp"
          : "jpg";

    const fileName = `avatar-${session.user.id}-${Date.now()}.${extension}`;

    const uploadFolder = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await fs.mkdir(uploadFolder, {
      recursive: true,
    });

    const filePath = path.join(uploadFolder, fileName);

    const bytes = await image.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      url: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء رفع الصورة" },
      { status: 500 }
    );
  }
}