import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const posts = await prisma.post.findMany({ include: { author: { select: { id: true, name: true, username: true, image: true } }, comments: true, likes: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit });
    const total = await prisma.post.count();
    return NextResponse.json({ posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { console.error("Error fetching posts:", error); return NextResponse.json({ error: "حدث خطأ أثناء جلب المواضيع" }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) { return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 }); }
    const body = await request.json();
    const { title, content } = body;
    if (!title || !content) { return NextResponse.json({ error: "العنوان والمحتوى مطلوبان" }, { status: 400 }); }
    const post = await prisma.post.create({ data: { title, content, authorId: session.user.id, published: true }, include: { author: { select: { id: true, name: true, username: true, image: true } } } });
    return NextResponse.json(post, { status: 201 });
  } catch (error) { console.error("Error creating post:", error); return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الموضوع" }, { status: 500 }); }
}
