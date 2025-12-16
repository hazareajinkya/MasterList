import { NextRequest, NextResponse } from 'next/server';
import { findMatchingUniversities, UserProfile } from '@/lib/matching';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      college, 
      bachelorsBranch,
      mastersPrograms,
      courses, // Keep for backward compatibility
      workExperience, 
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      companySector,
      designation,
      researchPapers,
      publications
    } = body;

    // Validation
    if (!college) {
      return NextResponse.json(
        { error: 'College is required' },
        { status: 400 }
      );
    }

    // Check for new format (bachelorsBranch + mastersPrograms) or old format (courses)
    if (!bachelorsBranch && (!courses || !Array.isArray(courses) || courses.length === 0)) {
      return NextResponse.json(
        { error: 'Bachelor\'s Branch is required' },
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

    // Optional field validations
    if (tenthPercentage !== null && tenthPercentage !== undefined) {
      if (typeof tenthPercentage !== 'number' || tenthPercentage < 0 || tenthPercentage > 100) {
        return NextResponse.json(
          { error: 'Valid 10th percentage (0-100) is required' },
          { status: 400 }
        );
      }
    }

    if (twelfthPercentage !== null && twelfthPercentage !== undefined) {
      if (typeof twelfthPercentage !== 'number' || twelfthPercentage < 0 || twelfthPercentage > 100) {
        return NextResponse.json(
          { error: 'Valid 12th percentage (0-100) is required' },
          { status: 400 }
        );
      }
    }

    const userProfile: UserProfile = {
      college: college.trim(),
      bachelorsBranch: bachelorsBranch ? bachelorsBranch.trim() : (courses?.[0]?.trim() || ''),
      mastersPrograms: programs.map((p: string) => p.trim()),
      courses: courses ? courses.map((c: string) => c.trim()) : undefined, // Backward compatibility
      workExperience: workExperience,
      cgpa: cgpa,
      tenthPercentage: tenthPercentage ?? null,
      twelfthPercentage: twelfthPercentage ?? null,
      companySector: companySector ? companySector.trim() : null,
      designation: designation ? designation.trim() : null,
      researchPapers: researchPapers ? parseInt(researchPapers.toString()) : null,
      publications: publications ? publications.trim() : null,
    };

    console.log('Finding matches for:', { 
      college: userProfile.college, 
      bachelorsBranch: userProfile.bachelorsBranch,
      mastersPrograms: userProfile.mastersPrograms 
    });
    
    let matchedUniversities;
    try {
      matchedUniversities = await findMatchingUniversities(userProfile);
      console.log('Found matches:', matchedUniversities.length);
      console.log('First match sample:', matchedUniversities[0] ? JSON.stringify(matchedUniversities[0]) : 'none');
    } catch (matchError) {
      console.error('Error in findMatchingUniversities:', matchError);
      throw matchError;
    }

    try {
      const response = {
        success: true,
        count: matchedUniversities.length,
        universities: matchedUniversities,
      };
      console.log('Returning response with', response.count, 'universities');
      return NextResponse.json(response);
    } catch (jsonError) {
      console.error('Error serializing response:', jsonError);
      throw jsonError;
    }
  } catch (error) {
    console.error('Error in match API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    // Return detailed error in development
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

