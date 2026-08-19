import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().max(50).nullable(),
  bio: z.string().trim().max(300).nullable(),
  image: z.string().url().max(500).nullable(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const data = profileSchema.parse({
      name: body.name?.trim() || null,
      bio: body.bio?.trim() || null,
      image: body.image?.trim() || null,
    });

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { error: "تعذر تحديث البروفايل" },
      { status: 400 }
    );
  }
}