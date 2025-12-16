const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // Test basic query
    const count = await prisma.alumni.count();
    console.log('Total alumni records:', count);
    
    // Test query with new fields
    const sample = await prisma.alumni.findFirst({
      select: {
        name: true,
        university: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        companySector: true,
        designation: true,
      }
    });
    console.log('Sample record:', sample);
    
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (error.message.includes('column') || error.message.includes('does not exist')) {
      console.error('⚠️  Missing database columns! Run the migration SQL in Supabase.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

test();

