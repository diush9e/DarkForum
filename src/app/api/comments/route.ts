import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'فشل جلب التعليقات' }, { status: 500 });
  }
}