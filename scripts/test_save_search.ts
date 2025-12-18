import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSaveSearch() {
  try {
    console.log('Testing search save...');
    
    const testResult = await prisma.matchResult.create({
      data: {
        userCGPA: 8.5,
        userWorkEx: 2,
        userBranch: 'Computer Science',
        userCollege: 'Test College',
        userCourses: ['MS in CS', 'MS in Data Science'],
        universities: [
          {
            university: 'Test University',
            course: 'MS in CS',
            matchScore: 85,
            location: 'USA',
          },
        ],
      },
    });
    
    console.log('✅ Test search saved successfully!');
    console.log('ID:', testResult.id);
    console.log('Created at:', testResult.createdAt);
    
    // Now fetch all searches
    const allSearches = await prisma.matchResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    
    console.log('\n📊 Total searches in database:', allSearches.length);
    console.log('Recent searches:');
    allSearches.forEach((search, index) => {
      console.log(`${index + 1}. ${search.userCollege} - ${search.userBranch} (CGPA: ${search.userCGPA})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testSaveSearch();

