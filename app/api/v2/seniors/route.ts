import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const seniors = await prisma.alumni.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        cgpa: true,
        workExperience: true,
        branch: true,
        university: true,
        course: true,
        location: true,
        admittedYear: true,
        college: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        companySector: true,
        designation: true,
        linkedInProfile: true,
        workExperiences: true,
      },
    });

    return NextResponse.json(seniors);
  } catch (error) {
    console.error('Error fetching seniors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

