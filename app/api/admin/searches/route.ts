import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const searches = await prisma.matchResult.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100 searches
    });

    return NextResponse.json(searches);
  } catch (error) {
    console.error('Error fetching search queries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

