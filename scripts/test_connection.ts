import { prisma } from '../lib/db';

async function testConnection() {
  try {
    console.log('Testing database connection...\n');
    
    // Test 1: Simple query to check connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');
    
    // Test 2: Check if tables exist
    const alumniCount = await prisma.alumni.count();
    console.log(`✅ Alumni table exists - Current records: ${alumniCount}`);
    
    const waitlistCount = await prisma.waitlistEmail.count();
    console.log(`✅ WaitlistEmail table exists - Current records: ${waitlistCount}`);
    
    const matchResultCount = await prisma.matchResult.count();
    console.log(`✅ MatchResult table exists - Current records: ${matchResultCount}\n`);
    
    // Test 3: Try a sample query
    const sampleAlumni = await prisma.alumni.findFirst();
    if (sampleAlumni) {
      console.log('✅ Sample query successful!');
      console.log(`   Found: ${sampleAlumni.name} -> ${sampleAlumni.university}`);
    } else {
      console.log('ℹ️  No alumni records found yet (this is expected if you haven\'t imported data)');
    }
    
    console.log('\n🎉 All connection tests passed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();


