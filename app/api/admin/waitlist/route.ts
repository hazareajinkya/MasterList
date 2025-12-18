import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const emails = await prisma.waitlistEmail.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching waitlist emails:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

