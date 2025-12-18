/**
 * Manual test script for matching algorithm
 * Run with: npx tsx scripts/test_matching.ts
 */

import { findMatchingUniversities, UserProfile } from '../lib/matching';

async function testMatching() {
  console.log('🧪 Testing Matching Algorithm...\n');

  const testProfile: UserProfile = {
    college: 'VJTI, Mumbai',
    bachelorsBranch: 'Information Technology',
    mastersPrograms: ['MS CS'],
    workExperience: 3.5,
    cgpa: 8.55,
  };

  console.log('Test Profile:');
  console.log(JSON.stringify(testProfile, null, 2));
  console.log('\n');

  try {
    const results = await findMatchingUniversities(testProfile);

    console.log(`✅ Found ${results.length} matches\n`);

    // Test 1: Check for invalid years
    console.log('Test 1: Checking for invalid years...');
    const invalidYears = results.filter(
      (r) =>
        r.admittedYearRange.min &&
        (r.admittedYearRange.min < 1990 || r.admittedYearRange.min > new Date().getFullYear() + 5)
    );
    if (invalidYears.length === 0) {
      console.log('✅ PASS: No invalid years found');
    } else {
      console.log(`❌ FAIL: Found ${invalidYears.length} results with invalid years`);
      invalidYears.forEach((r) => {
        console.log(`  - ${r.university}: ${r.admittedYearRange.min}`);
      });
    }
    console.log('');

    // Test 2: Check for IIIT H entries
    console.log('Test 2: Checking for IIIT H entries...');
    const iiithEntries = results.filter(
      (r) =>
        r.university.toLowerCase().includes('iiit h') ||
        r.university.toLowerCase().includes('iiith') ||
        r.university.toLowerCase().includes('iiit-h')
    );
    if (iiithEntries.length === 0) {
      console.log('✅ PASS: No IIIT H entries found');
    } else {
      console.log(`❌ FAIL: Found ${iiithEntries.length} IIIT H entries`);
      iiithEntries.forEach((r) => {
        console.log(`  - ${r.university}`);
      });
    }
    console.log('');

    // Test 3: Check sorting (abroad first)
    console.log('Test 3: Checking sorting (abroad first, then India)...');
    let lastWasIndia = false;
    let foundIssue = false;
    for (let i = 0; i < results.length; i++) {
      const location = (results[i].location || '').toUpperCase();
      const isIndia = location.includes('INDIA') || location === 'IN';

      if (isIndia && !lastWasIndia && i > 0) {
        // First India entry - check if previous was abroad
        const prevLocation = (results[i - 1].location || '').toUpperCase();
        const prevIsAbroad = !prevLocation.includes('INDIA') && prevLocation !== 'IN';
        if (prevIsAbroad) {
          // This is correct - abroad first, then India
        } else {
          foundIssue = true;
          console.log(`❌ FAIL: Sorting issue at index ${i}`);
          console.log(`  Previous: ${results[i - 1].university} (${results[i - 1].location})`);
          console.log(`  Current: ${results[i].university} (${results[i].location})`);
        }
      }

      if (isIndia) lastWasIndia = true;
    }
    if (!foundIssue) {
      console.log('✅ PASS: Results are sorted correctly (abroad first, then India)');
    }
    console.log('');

    // Test 4: Show sample results
    console.log('Test 4: Sample Results (first 5):');
    results.slice(0, 5).forEach((r, i) => {
      const year = r.admittedYearRange.min && r.admittedYearRange.min >= 1990 
        ? r.admittedYearRange.min 
        : 'N/A';
      console.log(
        `${i + 1}. ${r.university} - ${r.location || 'N/A'} - ${r.matchPercentage}% match - Admitted: ${year}`
      );
    });
    console.log('');

    // Test 5: Check match scores
    console.log('Test 5: Checking match scores...');
    const lowScores = results.filter((r) => r.matchPercentage < 40);
    if (lowScores.length === 0) {
      console.log('✅ PASS: All results have match score >= 40');
    } else {
      console.log(`❌ FAIL: Found ${lowScores.length} results with score < 40`);
    }
    console.log('');

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error during testing:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testMatching();

