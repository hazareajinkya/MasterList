import * as XLSX from 'xlsx';
import { prisma } from '../lib/db';
import { detectCompanySector } from '../lib/companySector';

interface ExcelRow {
  'Sr No.': number;
  'Student Name': string;
  'University Name': string;
  'University Country': string;
  "Master's Branch": string;
  "Master's start": number;
  "Master's end": number;
  "Master's grade": number | string | null;
  'MS Skills ': string | null;
  "Bachelor's Branch": string;
  "Bachelor's Degree Batch": number;
  'Cgpa': number | null;
  '10th Percentage/cgpa': number | null;
  '12th percentage/cgpa': number | null;
  'Exp 1 (in months)': number | null;
  'Exp 1 Company': string | null;
  'Designation': string | null;
  'Exp 2 (In months)': number | null;
  'Exp 2 Company': string | null;
  'Designation.1': string | null;
  'Exp 3 (In years)': number | null;
  'Exp 3 Company': string | null;
  'Designation.2': string | null;
  'Exp 4 (In years)': number | null;
  'Exp 4 Company': string | null;
  'Designation.3': string | null;
  'LinkedIn Profile': string | null;
}

function calculateWorkExperience(row: ExcelRow): number {
  let totalMonths = 0;
  
  // Convert all experience to months
  if (row['Exp 1 (in months)']) {
    totalMonths += row['Exp 1 (in months)'];
  }
  if (row['Exp 2 (In months)']) {
    totalMonths += row['Exp 2 (In months)'];
  }
  if (row['Exp 3 (In years)']) {
    totalMonths += row['Exp 3 (In years)'] * 12;
  }
  if (row['Exp 4 (In years)']) {
    totalMonths += row['Exp 4 (In years)'] * 12;
  }
  
  // Convert to years (rounded to 1 decimal)
  return Math.round((totalMonths / 12) * 10) / 10;
}

function parseLocation(universityName: string, country: string): string {
  // Extract state from university name if possible, otherwise use country
  const statePatterns = [
    /California|CA/,
    /New York|NY/,
    /Texas|TX/,
    /Massachusetts|MA/,
    /Pennsylvania|PA/,
    /Illinois|IL/,
    /Washington|WA/,
    /Georgia|GA/,
    /Arizona|AZ/,
    /North Carolina|NC/,
  ];
  
  for (const pattern of statePatterns) {
    if (pattern.test(universityName)) {
      const match = universityName.match(pattern);
      if (match) {
        return `${match[0]}, ${country}`;
      }
    }
  }
  
  return country;
}

function getCompanySector(row: ExcelRow): string | null {
  // Prioritize: First experience (Exp 1) is most relevant for admissions
  // Fallback to others if Exp 1 is not available
  const companies = [
    row['Exp 1 Company'],   // First experience (primary)
    row['Exp 2 Company'],   // Second experience
    row['Exp 3 Company'],   // Third experience
    row['Exp 4 Company'],   // Fourth experience
  ].filter(Boolean) as string[];

  if (companies.length === 0) return null;

  // Use the first available company (prioritizes Exp 1)
  const company = companies[0];
  return detectCompanySector(company);
}

function getDesignation(row: ExcelRow): string | null {
  // Prioritize: First experience (Exp 1) is most relevant for admissions
  // Fallback to others if Exp 1 is not available
  const designations = [
    row['Designation'],   // Exp 1 (primary)
    row['Designation.1'], // Exp 2
    row['Designation.2'], // Exp 3
    row['Designation.3'], // Exp 4
  ].filter(Boolean) as string[];

  if (designations.length === 0) return null;

  // Use the first available designation (prioritizes Exp 1)
  return designations[0].trim();
}

function getAllExperiences(row: ExcelRow): Array<{
  duration: number; // in months
  company: string;
  designation: string;
  type: string; // "Exp 1", "Exp 2", etc.
}> {
  const experiences: Array<{
    duration: number;
    company: string;
    designation: string;
    type: string;
  }> = [];

  // Exp 1 (in months)
  if (row['Exp 1 (in months)'] || row['Exp 1 Company'] || row['Designation']) {
    const duration = row['Exp 1 (in months)'] || 0;
    const company = row['Exp 1 Company']?.trim() || '';
    const designation = row['Designation']?.trim() || '';
    
    if (duration > 0 || company || designation) {
      experiences.push({
        duration: duration,
        company: company,
        designation: designation,
        type: 'Exp 1',
      });
    }
  }

  // Exp 2 (in months)
  if (row['Exp 2 (In months)'] || row['Exp 2 Company'] || row['Designation.1']) {
    const duration = row['Exp 2 (In months)'] || 0;
    const company = row['Exp 2 Company']?.trim() || '';
    const designation = row['Designation.1']?.trim() || '';
    
    if (duration > 0 || company || designation) {
      experiences.push({
        duration: duration,
        company: company,
        designation: designation,
        type: 'Exp 2',
      });
    }
  }

  // Exp 3 (in years)
  if (row['Exp 3 (In years)'] || row['Exp 3 Company'] || row['Designation.2']) {
    const duration = (row['Exp 3 (In years)'] || 0) * 12; // Convert to months
    const company = row['Exp 3 Company']?.trim() || '';
    const designation = row['Designation.2']?.trim() || '';
    
    if (duration > 0 || company || designation) {
      experiences.push({
        duration: duration,
        company: company,
        designation: designation,
        type: 'Exp 3',
      });
    }
  }

  // Exp 4 (in years)
  if (row['Exp 4 (In years)'] || row['Exp 4 Company'] || row['Designation.3']) {
    const duration = (row['Exp 4 (In years)'] || 0) * 12; // Convert to months
    const company = row['Exp 4 Company']?.trim() || '';
    const designation = row['Designation.3']?.trim() || '';
    
    if (duration > 0 || company || designation) {
      experiences.push({
        duration: duration,
        company: company,
        designation: designation,
        type: 'Exp 4',
      });
    }
  }

  // Return in order: Exp 1, Exp 2, Exp 3, Exp 4 (preserving Excel order)
  return experiences;
}

async function importSheet(sheetName: string, data: ExcelRow[]): Promise<{ imported: number; skipped: number }> {
  console.log(`\n📄 Processing sheet: ${sheetName}`);
  console.log(`   Found ${data.length} rows`);
  
  let imported = 0;
  let skipped = 0;

  for (const row of data) {
    try {
      // Skip if essential data is missing
      if (!row['Student Name'] || !row['University Name'] || !row["Bachelor's Branch"]) {
        skipped++;
        continue;
      }

      const cgpa = row['Cgpa'] || 0;
      const workExperience = calculateWorkExperience(row);
      const branch = row["Bachelor's Branch"].trim();
      const university = row['University Name'].trim().replace(/\n/g, ' ');
      const course = row["Master's Branch"]?.trim() || null;
      const location = parseLocation(university, row['University Country'] || 'USA');
      const admittedYear = row["Master's start"] ? Math.floor(row["Master's start"]) : null;
      const mastersEnd = row["Master's end"] ? Math.floor(row["Master's end"]) : null;
      // Handle mastersGrade - convert string to number if needed (handles "3,71" format)
      let mastersGrade: number | null = null;
      const mastersGradeValue = row["Master's grade"];
      if (mastersGradeValue !== null && mastersGradeValue !== undefined) {
        if (typeof mastersGradeValue === 'string') {
          // Replace comma with dot for European decimal format
          const gradeStr = String(mastersGradeValue).replace(',', '.');
          mastersGrade = parseFloat(gradeStr) || null;
        } else if (typeof mastersGradeValue === 'number') {
          mastersGrade = mastersGradeValue;
        }
      }
      const msSkills = row['MS Skills ']?.trim() || null;
      const bachelorsBatch = row["Bachelor's Degree Batch"] ? Math.floor(row["Bachelor's Degree Batch"]) : null;
      const tenthPercentage = row['10th Percentage/cgpa'] || null;
      const twelfthPercentage = row['12th percentage/cgpa'] || null;
      const companySector = getCompanySector(row);
      const designation = getDesignation(row);
      const linkedInProfile = row['LinkedIn Profile']?.trim() || null;
      const allExperiences = getAllExperiences(row);

      // Check if this record already exists
      const existing = await prisma.alumni.findFirst({
        where: {
          name: row['Student Name'].trim(),
          university: university,
        },
      });

      if (existing) {
        // Update existing record with new fields
        await prisma.alumni.update({
          where: { id: existing.id },
          data: {
            mastersEnd: mastersEnd,
            mastersGrade: mastersGrade,
            msSkills: msSkills,
            bachelorsBatch: bachelorsBatch,
            tenthPercentage: tenthPercentage,
            twelfthPercentage: twelfthPercentage,
            companySector: companySector,
            designation: designation,
            linkedInProfile: linkedInProfile,
            workExperiences: allExperiences.length > 0 ? allExperiences : undefined,
            // Also update other fields in case they changed
            cgpa: cgpa,
            workExperience: workExperience,
            branch: branch,
            course: course,
            location: location,
            admittedYear: admittedYear,
          },
        });
        imported++;
        continue;
      }

      // Create new alumni record
      await prisma.alumni.create({
        data: {
          name: row['Student Name'].trim(),
          cgpa: cgpa,
          workExperience: workExperience,
          branch: branch,
          university: university,
          course: course,
          location: location,
          admittedYear: admittedYear,
          mastersEnd: mastersEnd,
          mastersGrade: mastersGrade,
          msSkills: msSkills,
          bachelorsBatch: bachelorsBatch,
          college: 'VJTI, Mumbai',
          tenthPercentage: tenthPercentage,
          twelfthPercentage: twelfthPercentage,
          companySector: companySector,
          designation: designation,
          linkedInProfile: linkedInProfile,
          workExperiences: allExperiences.length > 0 ? allExperiences : undefined,
        },
      });

      imported++;
    } catch (error) {
      console.error(`   ❌ Error importing row ${row['Sr No.']}:`, error);
      skipped++;
    }
  }

  console.log(`   ✅ Imported: ${imported}, Skipped: ${skipped}`);
  return { imported, skipped };
}

async function importData() {
  try {
    // Read Excel file
    const workbook = XLSX.readFile('Alumni Master List.xlsx');
    const sheetNames = workbook.SheetNames;

    console.log(`📚 Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}`);

    let totalImported = 0;
    let totalSkipped = 0;

    // Process each sheet
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        console.log(`\n📄 Skipping empty sheet: ${sheetName}`);
        continue;
      }

      const result = await importSheet(sheetName, data);
      totalImported += result.imported;
      totalSkipped += result.skipped;
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`   Total imported: ${totalImported}`);
    console.log(`   Total skipped: ${totalSkipped}`);
    console.log(`   Sheets processed: ${sheetNames.length}`);
  } catch (error) {
    console.error('❌ Error reading Excel file:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importData()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
