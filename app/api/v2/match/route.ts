import { NextRequest, NextResponse } from 'next/server';
import { findMatchingUniversities, UserProfile } from '@/lib/matching';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      college, 
      bachelorsBranch,
      mastersPrograms,
      courses,
      workExperience, 
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      companySector,
      designation,
      researchPapers,
      publications
    } = body;

    // Validation (same as v1)
    if (!college) {
      return NextResponse.json(
        { error: 'College is required' },
        { status: 400 }
      );
    }

    const programs = mastersPrograms || courses || [];
    if (programs.length === 0) {
      return NextResponse.json(
        { error: 'At least one Master\'s Program is required' },
        { status: 400 }
      );
    }

    if (typeof workExperience !== 'number' || workExperience < 0) {
      return NextResponse.json(
        { error: 'Valid work experience (years) is required' },
        { status: 400 }
      );
    }

    if (typeof cgpa !== 'number' || cgpa < 0 || cgpa > 10) {
      return NextResponse.json(
        { error: 'Valid CGPA (0-10) is required' },
        { status: 400 }
      );
    }

    const userProfile: UserProfile = {
      college: college.trim(),
      bachelorsBranch: bachelorsBranch ? bachelorsBranch.trim() : (courses?.[0]?.trim() || ''),
      mastersPrograms: programs.map((p: string) => p.trim()),
      courses: courses ? courses.map((c: string) => c.trim()) : undefined,
      workExperience: workExperience,
      cgpa: cgpa,
      tenthPercentage: tenthPercentage ?? null,
      twelfthPercentage: twelfthPercentage ?? null,
      companySector: companySector ? companySector.trim() : null,
      designation: designation ? designation.trim() : null,
      researchPapers: researchPapers ? parseInt(researchPapers.toString()) : null,
      publications: publications ? publications.trim() : null,
    };

    // Get matching universities (same logic as v1)
    const matchedUniversities = await findMatchingUniversities(userProfile);

    // For each university, get the actual senior profiles
    const resultsWithSeniors = await Promise.all(
      matchedUniversities.map(async (uni) => {
        // Find all seniors who match this university and course
        const seniors = await prisma.alumni.findMany({
          where: {
            college: userProfile.college,
            university: uni.university,
            course: uni.course || undefined,
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

        // Filter out invalid years and IIIT H
        const validSeniors = seniors.filter((senior) => {
          // Filter IIIT H
          const universityName = senior.university.toLowerCase();
          if (universityName.includes('iiit h') || universityName.includes('iiith') || universityName.includes('iiit-h')) {
            return false;
          }
          // Filter invalid years
          if (senior.admittedYear && (senior.admittedYear < 1990 || senior.admittedYear > new Date().getFullYear() + 5)) {
            return false;
          }
          return true;
        });

        return {
          ...uni,
          seniors: validSeniors,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: resultsWithSeniors.length,
      universities: resultsWithSeniors,
    });
  } catch (error) {
    console.error('Error in v2 match API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

