import { prisma } from './db';

export interface UserProfile {
  college: string;
  bachelorsBranch: string;
  mastersPrograms: string[];
  courses?: string[]; // Keep for backward compatibility
  workExperience: number;
  cgpa: number;
  tenthPercentage?: number | null;
  twelfthPercentage?: number | null;
  companySector?: string | null;
  designation?: string | null;
  researchPapers?: number | null;
  publications?: string | null;
}

export interface MatchedUniversity {
  university: string;
  course: string | null;
  location: string | null;
  matchPercentage: number;
  alumniCount: number;
  admittedYearRange: {
    min: number | null;
    max: number | null;
  };
}

interface AlumniMatch {
  alumni: {
    university: string;
    course: string | null;
    location: string | null;
    admittedYear: number | null;
  };
  score: number;
}

// Course mapping for similarity
const courseMapping: Record<string, string[]> = {
  'Computer Science': ['Computer Science', 'CS', 'Computer Engineering', 'Software Engineering'],
  'Mechanical Engineering': ['Mechanical Engineering', 'Mechanical', 'ME'],
  'Civil Engineering': ['Civil Engineering', 'Civil', 'CE'],
  'Artificial Intelligence': ['Artificial Intelligence', 'AI', 'Machine Learning', 'Data Science'],
  'Management Studies': ['Management', 'MBA', 'Business Administration'],
  'Electronics & Communication': ['Electronics', 'ECE', 'Electronics Engineering', 'Communication'],
  'Electrical Engineering': ['Electrical Engineering', 'EE', 'Electrical'],
  'Data Science': ['Data Science', 'DS', 'Machine Learning', 'AI'],
  'MBA': ['MBA', 'Management', 'Business Administration'],
  'Finance': ['Finance', 'Financial Engineering', 'MBA'],
};

function normalizeBranch(branch: string): string {
  return branch.toLowerCase().trim();
}

function isCourseMatch(userCourse: string, alumniBranch: string, alumniCourse: string | null): boolean {
  const normalizedUserCourse = normalizeBranch(userCourse);
  const normalizedAlumniBranch = normalizeBranch(alumniBranch);
  const normalizedAlumniCourse = alumniCourse ? normalizeBranch(alumniCourse) : '';

  // Check if user course matches alumni branch or course
  if (normalizedAlumniBranch.includes(normalizedUserCourse) || 
      normalizedUserCourse.includes(normalizedAlumniBranch)) {
    return true;
  }

  if (normalizedAlumniCourse && (
    normalizedAlumniCourse.includes(normalizedUserCourse) ||
    normalizedUserCourse.includes(normalizedAlumniCourse)
  )) {
    return true;
  }

  // Check course mapping
  const userCourseVariants = courseMapping[userCourse] || [userCourse];
  for (const variant of userCourseVariants) {
    if (normalizedAlumniBranch.includes(normalizeBranch(variant)) ||
        (normalizedAlumniCourse && normalizedAlumniCourse.includes(normalizeBranch(variant)))) {
      return true;
    }
  }

  return false;
}

function calculateMatchScore(
  userProfile: UserProfile,
  alumni: {
    cgpa: number;
    workExperience: number;
    branch: string;
    course: string | null;
    tenthPercentage: number | null;
    twelfthPercentage: number | null;
    companySector: string | null;
    designation: string | null;
  }
): number {
  let score = 0;
  const maxScore = 100;
  let totalWeight = 0;

  // CGPA matching (30% weight) - ±0.5 range
  const cgpaDiff = Math.abs(userProfile.cgpa - alumni.cgpa);
  if (cgpaDiff <= 0.5) {
    score += 30 * (1 - cgpaDiff / 0.5);
  } else if (cgpaDiff <= 1.0) {
    score += 15 * (1 - (cgpaDiff - 0.5) / 0.5);
  }
  totalWeight += 30;

  // Work Experience matching (25% weight) - ±1 year range
  const workExDiff = Math.abs(userProfile.workExperience - alumni.workExperience);
  if (workExDiff <= 1.0) {
    score += 25 * (1 - workExDiff / 1.0);
  } else if (workExDiff <= 2.0) {
    score += 12.5 * (1 - (workExDiff - 1.0) / 1.0);
  }
  totalWeight += 25;

  // Bachelor's Branch matching (20% weight) - Primary matching
  const normalizedUserBranch = normalizeBranch(userProfile.bachelorsBranch || userProfile.courses?.[0] || '');
  const normalizedAlumniBranch = normalizeBranch(alumni.branch);
  
  if (normalizedUserBranch === normalizedAlumniBranch) {
    score += 20; // Exact match
  } else if (normalizedAlumniBranch.includes(normalizedUserBranch) || normalizedUserBranch.includes(normalizedAlumniBranch)) {
    score += 15; // Partial match
  } else {
    // Check for similar branches
    const userBranchWords = normalizedUserBranch.split(/\s+/);
    const alumniBranchWords = normalizedAlumniBranch.split(/\s+/);
    const commonWords = userBranchWords.filter(word => alumniBranchWords.includes(word) && word.length > 3);
    if (commonWords.length >= 1) {
      score += 10; // Weak match
    }
  }
  totalWeight += 20;

  // Master's Program matching (10% weight) - Secondary matching
  const userMastersPrograms = userProfile.mastersPrograms || userProfile.courses || [];
  if (userMastersPrograms.length > 0 && alumni.course) {
    const normalizedAlumniCourse = normalizeBranch(alumni.course);
    let mastersMatched = false;
    
    for (const userProgram of userMastersPrograms) {
      const normalizedUserProgram = normalizeBranch(userProgram);
      // Check if user's desired program matches alumni's master's course
      if (normalizedAlumniCourse.includes(normalizedUserProgram) || 
          normalizedUserProgram.includes(normalizedAlumniCourse) ||
          // Check for program type matches (MS, MEM, MBA, etc.)
          (normalizedUserProgram.includes('ms') && normalizedAlumniCourse.includes('ms')) ||
          (normalizedUserProgram.includes('mem') && normalizedAlumniCourse.includes('mem')) ||
          (normalizedUserProgram.includes('mba') && normalizedAlumniCourse.includes('mba'))) {
        mastersMatched = true;
        break;
      }
    }
    
    if (mastersMatched) {
      score += 10;
    } else {
      score += 5; // Partial match for any master's program
    }
  }
  totalWeight += 10;

  // 10th Percentage matching (5% weight) - if both provided
  if (userProfile.tenthPercentage && alumni.tenthPercentage) {
    const tenthDiff = Math.abs(userProfile.tenthPercentage - alumni.tenthPercentage);
    if (tenthDiff <= 5) {
      score += 5 * (1 - tenthDiff / 5);
    } else if (tenthDiff <= 10) {
      score += 2.5 * (1 - (tenthDiff - 5) / 5);
    }
    totalWeight += 5;
  }

  // 12th Percentage matching (5% weight) - if both provided
  if (userProfile.twelfthPercentage && alumni.twelfthPercentage) {
    const twelfthDiff = Math.abs(userProfile.twelfthPercentage - alumni.twelfthPercentage);
    if (twelfthDiff <= 5) {
      score += 5 * (1 - twelfthDiff / 5);
    } else if (twelfthDiff <= 10) {
      score += 2.5 * (1 - (twelfthDiff - 5) / 5);
    }
    totalWeight += 5;
  }

  // Company Sector matching (5% weight) - if both provided
  if (userProfile.companySector && alumni.companySector) {
    if (userProfile.companySector.toLowerCase() === alumni.companySector.toLowerCase()) {
      score += 5;
    }
    totalWeight += 5;
  }

  // Designation matching (5% weight) - if both provided
  if (userProfile.designation && alumni.designation) {
    const userDesig = userProfile.designation.toLowerCase();
    const alumniDesig = alumni.designation.toLowerCase();
    
    // Exact match
    if (userDesig === alumniDesig) {
      score += 5;
    } else {
      // Partial match for similar roles (e.g., Software Engineer vs Senior Software Engineer)
      const userWords = userDesig.split(/\s+/);
      const alumniWords = alumniDesig.split(/\s+/);
      const commonWords = userWords.filter(word => alumniWords.includes(word));
      
      if (commonWords.length >= 2) {
        score += 3; // Partial match
      } else if (commonWords.length === 1 && commonWords[0].length > 3) {
        score += 1.5; // Weak match
      }
    }
    totalWeight += 5;
  }

  // Normalize score to 100 if we have additional fields
  if (totalWeight > 100) {
    score = (score / totalWeight) * 100;
  }

  return Math.min(Math.round(score), maxScore);
}

export async function findMatchingUniversities(
  userProfile: UserProfile
): Promise<MatchedUniversity[]> {
  try {
    // Query alumni from the same college
    const alumni = await prisma.alumni.findMany({
      where: {
        college: userProfile.college,
      },
      select: {
        university: true,
        course: true,
        location: true,
        cgpa: true,
        workExperience: true,
        branch: true,
        admittedYear: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        companySector: true,
        designation: true,
      },
    });

    console.log(`Found ${alumni.length} alumni records for college: ${userProfile.college}`);

    // Calculate match scores for each alumni
    const matches: AlumniMatch[] = alumni.map((alum) => ({
    alumni: {
      university: alum.university,
      course: alum.course,
      location: alum.location,
      admittedYear: alum.admittedYear,
    },
    score: calculateMatchScore(userProfile, {
      cgpa: alum.cgpa,
      workExperience: alum.workExperience,
      branch: alum.branch,
      course: alum.course,
      tenthPercentage: alum.tenthPercentage,
      twelfthPercentage: alum.twelfthPercentage,
      companySector: alum.companySector,
      designation: alum.designation,
    }),
    }));

    // Filter matches with score >= 50
    const validMatches = matches.filter((m) => m.score >= 50);

    // Group by university and course
    const universityMap = new Map<string, {
      university: string;
      course: string | null;
      location: string | null;
      scores: number[];
      years: (number | null)[];
    }>();

    for (const match of validMatches) {
    const key = `${match.alumni.university}|${match.alumni.course || 'N/A'}`;
    const existing = universityMap.get(key);

    if (existing) {
      existing.scores.push(match.score);
      existing.years.push(match.alumni.admittedYear);
    } else {
      universityMap.set(key, {
        university: match.alumni.university,
        course: match.alumni.course,
        location: match.alumni.location,
        scores: [match.score],
        years: [match.alumni.admittedYear],
      });
      }
    }

    // Convert to MatchedUniversity array
    const matchedUniversities: MatchedUniversity[] = Array.from(universityMap.values()).map((uni) => {
    const avgScore = Math.round(
      uni.scores.reduce((sum, score) => sum + score, 0) / uni.scores.length
    );
    
    const validYears = uni.years.filter((y): y is number => y !== null);
    const yearRange = {
      min: validYears.length > 0 ? Math.min(...validYears) : null,
      max: validYears.length > 0 ? Math.max(...validYears) : null,
    };

    return {
      university: uni.university,
      course: uni.course,
      location: uni.location,
      matchPercentage: avgScore,
      alumniCount: uni.scores.length,
      admittedYearRange: yearRange,
      };
    });

    // Sort by match percentage (descending)
    matchedUniversities.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return matchedUniversities;
  } catch (error) {
    console.error('Error in findMatchingUniversities:', error);
    throw error;
  }
}

