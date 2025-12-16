'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { detectCompanySector, getSectorOptions } from '@/lib/companySector';

const colleges = [
  'VJTI, Mumbai',
  // Add more colleges as needed
];

const bachelorsBranches = [
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Electrical Engineering',
  'Information Technology',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Other',
];

const mastersPrograms = [
  'MS CS',
  'MS CSE',
  'MS CE',
  'MS EE',
  'MS ECE',
  'MS DS',
  'MS ME',
  'MIS',
  'MEM',
  'MBA',
  'Other',
];

const designations = [
  'Software Engineer',
  'Senior Software Engineer',
  'Software Development Engineer',
  'Software Development Engineer II',
  'Software Development Engineer III',
  'Lead Software Engineer',
  'Principal Software Engineer',
  'Staff Software Engineer',
  'Engineering Manager',
  'Product Manager',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'QA Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Other',
];

export default function FindSeniors() {
  const router = useRouter();
  const [isDetailedMode, setIsDetailedMode] = useState(false);
  const [formData, setFormData] = useState({
    college: 'VJTI, Mumbai',
    bachelorsBranch: '',
    mastersPrograms: [] as string[],
    workExperience: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    companyName: '',
    companySector: '',
    designation: '',
    researchPapers: '',
    publications: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMastersProgramChange = (program: string) => {
    setFormData((prev) => {
      const newPrograms = prev.mastersPrograms.includes(program)
        ? prev.mastersPrograms.filter((p) => p !== program)
        : [...prev.mastersPrograms, program];
      return { ...prev, mastersPrograms: newPrograms };
    });
    if (errors.mastersPrograms) {
      setErrors((prev) => ({ ...prev, mastersPrograms: '' }));
    }
  };

  const handleCompanyNameChange = (companyName: string) => {
    const detectedSector = detectCompanySector(companyName);
    setFormData((prev) => ({
      ...prev,
      companyName,
      companySector: detectedSector || prev.companySector,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.college) {
      newErrors.college = 'Please select your college';
    }

    if (!formData.bachelorsBranch) {
      newErrors.bachelorsBranch = 'Please select your Bachelor\'s Degree Branch';
    }

    if (formData.mastersPrograms.length === 0) {
      newErrors.mastersPrograms = 'Please select at least one Master\'s Program';
    }

    const workEx = parseFloat(formData.workExperience);
    if (isNaN(workEx) || workEx < 0) {
      newErrors.workExperience = 'Please enter a valid work experience (years)';
    }

    const cgpa = parseFloat(formData.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      newErrors.cgpa = 'Please enter a valid CGPA (0-10)';
    }

    // Detailed mode validations
    if (isDetailedMode) {
      const tenth = parseFloat(formData.tenthPercentage);
      if (formData.tenthPercentage && (isNaN(tenth) || tenth < 0 || tenth > 100)) {
        newErrors.tenthPercentage = 'Please enter a valid 10th percentage (0-100)';
      }

      const twelfth = parseFloat(formData.twelfthPercentage);
      if (formData.twelfthPercentage && (isNaN(twelfth) || twelfth < 0 || twelfth > 100)) {
        newErrors.twelfthPercentage = 'Please enter a valid 12th percentage (0-100)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Store form data in sessionStorage to pass to results page
    sessionStorage.setItem(
      'searchParams',
      JSON.stringify({
        college: formData.college,
        bachelorsBranch: formData.bachelorsBranch,
        mastersPrograms: formData.mastersPrograms,
        courses: formData.mastersPrograms, // Keep for backward compatibility
        workExperience: parseFloat(formData.workExperience),
        cgpa: parseFloat(formData.cgpa),
        tenthPercentage: formData.tenthPercentage ? parseFloat(formData.tenthPercentage) : null,
        twelfthPercentage: formData.twelfthPercentage ? parseFloat(formData.twelfthPercentage) : null,
        companyName: formData.companyName || null,
        companySector: formData.companySector || null,
        designation: formData.designation || null,
        researchPapers: formData.researchPapers || null,
        publications: formData.publications || null,
      })
    );

    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-primary hover:text-primary-dark mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Master List - <span className="text-primary">Discover Your Path</span>
          </h1>
          <p className="text-gray-600 mb-4">
            Enter your details to get probability-based matches from publicly available alumni admission data.
          </p>

          {/* Mode Toggle */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDetailedMode}
                    onChange={(e) => setIsDetailedMode(e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Detailed Mode (Increases Accuracy)
                  </span>
                </label>
                <p className="text-xs text-gray-600 mt-1 ml-6">
                  Provide more details to get better matches and see which colleges you can get into
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> All results are probability-based and derived from public sources. 
              Admissions are subject to individual capabilities, application quality, and various other factors. 
              This tool is designed to help you figure out possibilities from previous data and should not be 
              considered as a guarantee of admission.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current College
              </label>
              <select
                value={formData.college}
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
              {errors.college && (
                <p className="mt-1 text-sm text-red-600">{errors.college}</p>
              )}
            </div>

            {/* Bachelor's Degree Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bachelor's Degree Branch <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bachelorsBranch}
                onChange={(e) =>
                  setFormData({ ...formData, bachelorsBranch: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select your Bachelor's Branch</option>
                {bachelorsBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              {errors.bachelorsBranch && (
                <p className="mt-1 text-sm text-red-600">{errors.bachelorsBranch}</p>
              )}
            </div>

            {/* Desired Master's Programs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Master's Program(s) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select the Master's programs you're interested in (e.g., MS CS, MEM, MBA)
              </p>
              <div className="grid grid-cols-2 gap-4">
                {mastersPrograms.map((program) => (
                  <label
                    key={program}
                    className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.mastersPrograms.includes(program)}
                      onChange={() => handleMastersProgramChange(program)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{program}</span>
                  </label>
                ))}
              </div>
              {errors.mastersPrograms && (
                <p className="mt-1 text-sm text-red-600">{errors.mastersPrograms}</p>
              )}
            </div>

            {/* Work Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Experience (years)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.workExperience}
                onChange={(e) =>
                  setFormData({ ...formData, workExperience: e.target.value })
                }
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.workExperience && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.workExperience}
                </p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA (out of 10)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) =>
                  setFormData({ ...formData, cgpa: e.target.value })
                }
                placeholder="e.g., 8.75"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.cgpa && (
                <p className="mt-1 text-sm text-red-600">{errors.cgpa}</p>
              )}
            </div>

            {/* Detailed Mode Fields */}
            {isDetailedMode && (
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">
                    Additional Details (Optional but Recommended)
                  </h3>

                  {/* 10th Percentage */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      10th Standard Percentage/CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.tenthPercentage}
                      onChange={(e) =>
                        setFormData({ ...formData, tenthPercentage: e.target.value })
                      }
                      placeholder="e.g., 85.75"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.tenthPercentage && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.tenthPercentage}
                      </p>
                    )}
                  </div>

                  {/* 12th Percentage */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      12th Standard Percentage/CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.twelfthPercentage}
                      onChange={(e) =>
                        setFormData({ ...formData, twelfthPercentage: e.target.value })
                      }
                      placeholder="e.g., 88.25"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.twelfthPercentage && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.twelfthPercentage}
                      </p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleCompanyNameChange(e.target.value)}
                      placeholder="e.g., Microsoft, Google, Amazon"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      We'll automatically detect the sector based on company name
                    </p>
                  </div>

                  {/* Company Sector */}
                  {formData.companySector && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Sector
                      </label>
                      <select
                        value={formData.companySector}
                        onChange={(e) =>
                          setFormData({ ...formData, companySector: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select or keep auto-detected</option>
                        {getSectorOptions().map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Designation */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Designation
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({ ...formData, designation: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select your designation</option>
                      {designations.map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Your role helps us match you with similar profiles
                    </p>
                  </div>

                  {/* Additional Achievements Section */}
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">
                      Additional Achievements & Research
                    </h4>

                    {/* Research Papers */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Research Papers Published
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.researchPapers}
                        onChange={(e) =>
                          setFormData({ ...formData, researchPapers: e.target.value })
                        }
                        placeholder="e.g., 2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Number of research papers you've published
                      </p>
                    </div>

                    {/* Publications */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publications
                      </label>
                      <textarea
                        value={formData.publications}
                        onChange={(e) =>
                          setFormData({ ...formData, publications: e.target.value })
                        }
                        placeholder="List your publications, conferences, journals, etc."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        List any publications, conference papers, journal articles, etc.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-primary-dark hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Find My Seniors</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
