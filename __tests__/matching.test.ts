import { findMatchingUniversities, UserProfile } from '@/lib/matching';
import { prisma } from '@/lib/db';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    alumni: {
      findMany: jest.fn(),
    },
  },
}));

describe('Matching Algorithm Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should filter out invalid years (like 44558)', async () => {
    const mockAlumni = [
      {
        university: 'Test University',
        course: 'MS CS',
        location: 'US',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 44558, // Invalid year
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
      {
        university: 'Test University 2',
        course: 'MS CS',
        location: 'US',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 2019, // Valid year
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
    ];

    (prisma.alumni.findMany as jest.Mock).mockResolvedValue(mockAlumni);

    const userProfile: UserProfile = {
      college: 'VJTI, Mumbai',
      bachelorsBranch: 'Computer Science',
      mastersPrograms: ['MS CS'],
      workExperience: 3,
      cgpa: 8.5,
    };

    const results = await findMatchingUniversities(userProfile);

    // Should only show valid year (2019), not 44558
    results.forEach((result) => {
      if (result.admittedYearRange.min) {
        expect(result.admittedYearRange.min).toBeGreaterThanOrEqual(1990);
        expect(result.admittedYearRange.min).toBeLessThanOrEqual(new Date().getFullYear() + 5);
      }
    });
  });

  test('should filter out IIIT H entries', async () => {
    const mockAlumni = [
      {
        university: 'IIIT H',
        course: 'MS CS',
        location: 'INDIA',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 2020,
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
      {
        university: 'New York University',
        course: 'MS CS',
        location: 'US',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 2019,
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
    ];

    (prisma.alumni.findMany as jest.Mock).mockResolvedValue(mockAlumni);

    const userProfile: UserProfile = {
      college: 'VJTI, Mumbai',
      bachelorsBranch: 'Computer Science',
      mastersPrograms: ['MS CS'],
      workExperience: 3,
      cgpa: 8.5,
    };

    const results = await findMatchingUniversities(userProfile);

    // Should not contain IIIT H
    const hasIIITH = results.some(
      (r) =>
        r.university.toLowerCase().includes('iiit h') ||
        r.university.toLowerCase().includes('iiith') ||
        r.university.toLowerCase().includes('iiit-h')
    );
    expect(hasIIITH).toBe(false);
  });

  test('should match Information Technology with IT and Computer Science', async () => {
    const mockAlumni = [
      {
        university: 'Test University',
        course: 'MS CS',
        location: 'US',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'IT', // Should match with Information Technology
        admittedYear: 2019,
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
    ];

    (prisma.alumni.findMany as jest.Mock).mockResolvedValue(mockAlumni);

    const userProfile: UserProfile = {
      college: 'VJTI, Mumbai',
      bachelorsBranch: 'Information Technology',
      mastersPrograms: ['MS CS'],
      workExperience: 3,
      cgpa: 8.5,
    };

    const results = await findMatchingUniversities(userProfile);

    // Should find matches even though branch is "IT" and user has "Information Technology"
    expect(results.length).toBeGreaterThan(0);
  });

  test('should sort results: abroad first, then India', async () => {
    const mockAlumni = [
      {
        university: 'Indian University',
        course: 'MS CS',
        location: 'INDIA',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 2019,
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
      {
        university: 'US University',
        course: 'MS CS',
        location: 'US',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 2019,
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
    ];

    (prisma.alumni.findMany as jest.Mock).mockResolvedValue(mockAlumni);

    const userProfile: UserProfile = {
      college: 'VJTI, Mumbai',
      bachelorsBranch: 'Computer Science',
      mastersPrograms: ['MS CS'],
      workExperience: 3,
      cgpa: 8.5,
    };

    const results = await findMatchingUniversities(userProfile);

    // First result should be from abroad (US), not India
    if (results.length >= 2) {
      const firstLocation = results[0].location?.toUpperCase() || '';
      const isFirstAbroad = !firstLocation.includes('INDIA');
      expect(isFirstAbroad).toBe(true);
    }
  });

  test('should return results with match score >= 40', async () => {
    const mockAlumni = [
      {
        university: 'Test University',
        course: 'MS CS',
        location: 'US',
        cgpa: 8.5,
        workExperience: 3,
        branch: 'Computer Science',
        admittedYear: 2019,
        tenthPercentage: null,
        twelfthPercentage: null,
        companySector: null,
        designation: null,
      },
    ];

    (prisma.alumni.findMany as jest.Mock).mockResolvedValue(mockAlumni);

    const userProfile: UserProfile = {
      college: 'VJTI, Mumbai',
      bachelorsBranch: 'Computer Science',
      mastersPrograms: ['MS CS'],
      workExperience: 3,
      cgpa: 8.5,
    };

    const results = await findMatchingUniversities(userProfile);

    // All results should have match percentage >= 40
    results.forEach((result) => {
      expect(result.matchPercentage).toBeGreaterThanOrEqual(40);
    });
  });
});

