import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { z } from "zod";
const registerSchema = z.object({ username: z.string().min(3).max(30), email: z.string().email(), password: z.string().min(8) });
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = registerSchema.parse(body);
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingUser) { return NextResponse.json({ error: "المستخدم موجود بالفعل" }, { status: 400 }); }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { username, email, password: hashedPassword } });
    return NextResponse.json({ success: true });
  } catch (error) { console.error("Registration error:", error); return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 }); }
}
