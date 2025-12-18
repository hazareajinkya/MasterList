'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { detectCompanySector, getSectorOptions } from '@/lib/companySector';

const colleges = ['VJTI, Mumbai'];
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

interface Senior {
  id: string;
  name: string;
  cgpa: number;
  workExperience: number;
  branch: string;
  university: string;
  course: string | null;
  location: string | null;
  admittedYear: number | null;
  college: string;
  tenthPercentage: number | null;
  twelfthPercentage: number | null;
  companySector: string | null;
  designation: string | null;
  linkedInProfile: string | null;
  workExperiences: any;
}

interface MatchedUniversity {
  university: string;
  course: string | null;
  location: string | null;
  matchPercentage: number;
  alumniCount: number;
  admittedYearRange: {
    min: number | null;
    max: number | null;
  };
  seniors: Senior[];
}

export default function V2Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [results, setResults] = useState<MatchedUniversity[]>([]);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    college: 'VJTI, Mumbai',
    bachelorsBranch: '',
    mastersPrograms: [] as string[],
    workExperience: '',
    cgpa: '',
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('v2_authenticated');
    if (authStatus !== 'true') {
      router.push('/v2');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  const handleMastersProgramChange = (program: string) => {
    setFormData((prev) => {
      const newPrograms = prev.mastersPrograms.includes(program)
        ? prev.mastersPrograms.filter((p) => p !== program)
        : [...prev.mastersPrograms, program];
      return { ...prev, mastersPrograms: newPrograms };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setShowSearch(false);

    try {
      const response = await fetch('/api/v2/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          college: formData.college,
          bachelorsBranch: formData.bachelorsBranch,
          mastersPrograms: formData.mastersPrograms,
          workExperience: parseFloat(formData.workExperience),
          cgpa: parseFloat(formData.cgpa),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.universities || []);
      } else {
        alert(data.error || 'Failed to fetch matches');
        setShowSearch(true);
      }
    } catch (error) {
      alert('Error connecting to server');
      setShowSearch(true);
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('v2_authenticated');
    sessionStorage.removeItem('v2_adminId');
    router.push('/v2');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              Master List <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">V2</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{sessionStorage.getItem('v2_adminId')}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSearch ? (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Seniors</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College *
                </label>
                <select
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bachelor's Branch *
                </label>
                <select
                  value={formData.bachelorsBranch}
                  onChange={(e) => setFormData({ ...formData, bachelorsBranch: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select branch</option>
                  {bachelorsBranches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master's Program(s) *
                </label>
                <div className="space-y-2">
                  {mastersPrograms.map((program) => (
                    <label key={program} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.mastersPrograms.includes(program)}
                        onChange={() => handleMastersProgramChange(program)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-700">{program}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience (years) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.workExperience}
                    onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CGPA (out of 10) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 font-semibold transition"
              >
                {searching ? 'Searching...' : 'Find My Seniors'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setShowSearch(true);
                setResults([]);
              }}
              className="mb-4 text-purple-600 hover:text-purple-700 flex items-center"
            >
              ← Back to Search
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Probability-Based Matches from {formData.college}
              </h2>
              <p className="text-gray-600 mt-1">{results.length} matches found</p>
            </div>

            <div className="space-y-6">
              {results.map((uni, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{uni.university}</h3>
                      {uni.course && <p className="text-gray-600">{uni.course}</p>}
                      {uni.location && <p className="text-sm text-gray-500">{uni.location}</p>}
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      {uni.matchPercentage}% match
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {uni.seniors.length} Senior{uni.seniors.length !== 1 ? 's' : ''} Profile{uni.seniors.length !== 1 ? 's' : ''}:
                    </h4>
                    <div className="space-y-4">
                      {uni.seniors.map((senior) => (
                        <div key={senior.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 text-lg">{senior.name}</h5>
                              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">CGPA:</span>
                                  <span className="ml-2 font-medium">{senior.cgpa}/10</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Work Exp:</span>
                                  <span className="ml-2 font-medium">{senior.workExperience} years</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Branch:</span>
                                  <span className="ml-2 font-medium">{senior.branch}</span>
                                </div>
                                {senior.admittedYear && senior.admittedYear >= 1990 && (
                                  <div>
                                    <span className="text-gray-600">Admitted:</span>
                                    <span className="ml-2 font-medium">{senior.admittedYear}</span>
                                  </div>
                                )}
                                {senior.tenthPercentage && (
                                  <div>
                                    <span className="text-gray-600">10th %:</span>
                                    <span className="ml-2 font-medium">{senior.tenthPercentage}%</span>
                                  </div>
                                )}
                                {senior.twelfthPercentage && (
                                  <div>
                                    <span className="text-gray-600">12th %:</span>
                                    <span className="ml-2 font-medium">{senior.twelfthPercentage}%</span>
                                  </div>
                                )}
                                {senior.designation && (
                                  <div>
                                    <span className="text-gray-600">Designation:</span>
                                    <span className="ml-2 font-medium">{senior.designation}</span>
                                  </div>
                                )}
                                {senior.companySector && (
                                  <div>
                                    <span className="text-gray-600">Sector:</span>
                                    <span className="ml-2 font-medium">{senior.companySector}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {senior.linkedInProfile && (
                              <a
                                href={senior.linkedInProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 whitespace-nowrap"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span>LinkedIn</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
