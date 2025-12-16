// Test the matching function
const { findMatchingUniversities } = require('./lib/matching.ts');

async function test() {
  try {
    const userProfile = {
      college: 'VJTI, Mumbai',
      courses: ['Computer Science'],
      workExperience: 2,
      cgpa: 8.5,
      tenthPercentage: null,
      twelfthPercentage: null,
      companySector: null,
      designation: null,
    };

    console.log('Testing findMatchingUniversities...');
    const results = await findMatchingUniversities(userProfile);
    console.log('✅ Success! Found', results.length, 'matches');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();

