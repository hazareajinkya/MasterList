const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testMatching() {
  try {
    console.log('Testing database query...');
    
    const alumni = await prisma.alumni.findMany({
      where: {
        college: 'VJTI, Mumbai',
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
      take: 5,
    });

    console.log('✅ Query successful! Found', alumni.length, 'records');
    console.log('Sample record:', JSON.stringify(alumni[0], null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    if (error.message.includes('column') || error.message.includes('does not exist')) {
      console.error('\n⚠️  Missing database columns!');
      console.error('Run the migration SQL in Supabase.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testMatching();

