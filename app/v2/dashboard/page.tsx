'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SeniorProfile {
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

export default function V2Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [seniors, setSeniors] = useState<SeniorProfile[]>([]);
  const [selectedSenior, setSelectedSenior] = useState<SeniorProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'profile'>('search');

  useEffect(() => {
    // Check authentication
    const authStatus = sessionStorage.getItem('v2_authenticated');
    if (authStatus !== 'true') {
      router.push('/v2');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
    fetchSeniors();
  }, [router]);

  const fetchSeniors = async () => {
    try {
      const response = await fetch('/api/v2/seniors');
      if (response.ok) {
        const data = await response.json();
        setSeniors(data);
      }
    } catch (error) {
      console.error('Error fetching seniors:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('v2_authenticated');
    sessionStorage.removeItem('v2_adminId');
    router.push('/v2');
  };

  const filteredSeniors = seniors.filter((senior) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      senior.name.toLowerCase().includes(query) ||
      senior.university.toLowerCase().includes(query) ||
      senior.college.toLowerCase().includes(query) ||
      (senior.course && senior.course.toLowerCase().includes(query)) ||
      (senior.branch && senior.branch.toLowerCase().includes(query))
    );
  });

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                Master List <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">V2</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {sessionStorage.getItem('v2_adminId')}
              </span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Search & List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Seniors</h2>
              
              <input
                type="text"
                placeholder="Search by name, university, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4"
              />

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredSeniors.map((senior) => (
                  <div
                    key={senior.id}
                    onClick={() => {
                      setSelectedSenior(senior);
                      setActiveTab('profile');
                    }}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedSenior?.id === senior.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{senior.name}</h3>
                    <p className="text-sm text-gray-600">{senior.university}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {senior.course || senior.branch} • CGPA: {senior.cgpa}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                {filteredSeniors.length} senior{filteredSeniors.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Right Side - Profile View */}
          <div className="lg:col-span-2">
            {selectedSenior ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSenior.name}</h2>
                    <p className="text-lg text-gray-600 mt-1">{selectedSenior.university}</p>
                  </div>
                  {selectedSenior.linkedInProfile && (
                    <a
                      href={selectedSenior.linkedInProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>Connect on LinkedIn</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Academic Profile</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">College:</span>
                        <span className="ml-2 font-medium">{selectedSenior.college}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Branch:</span>
                        <span className="ml-2 font-medium">{selectedSenior.branch}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">CGPA:</span>
                        <span className="ml-2 font-medium">{selectedSenior.cgpa}/10</span>
                      </div>
                      {selectedSenior.tenthPercentage && (
                        <div>
                          <span className="text-sm text-gray-600">10th %:</span>
                          <span className="ml-2 font-medium">{selectedSenior.tenthPercentage}%</span>
                        </div>
                      )}
                      {selectedSenior.twelfthPercentage && (
                        <div>
                          <span className="text-sm text-gray-600">12th %:</span>
                          <span className="ml-2 font-medium">{selectedSenior.twelfthPercentage}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Master's Program</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">University:</span>
                        <span className="ml-2 font-medium">{selectedSenior.university}</span>
                      </div>
                      {selectedSenior.course && (
                        <div>
                          <span className="text-sm text-gray-600">Course:</span>
                          <span className="ml-2 font-medium">{selectedSenior.course}</span>
                        </div>
                      )}
                      {selectedSenior.location && (
                        <div>
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{selectedSenior.location}</span>
                        </div>
                      )}
                      {selectedSenior.admittedYear && selectedSenior.admittedYear >= 1990 && (
                        <div>
                          <span className="text-sm text-gray-600">Admitted:</span>
                          <span className="ml-2 font-medium">{selectedSenior.admittedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Work Experience</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Total Experience:</span>
                        <span className="ml-2 font-medium">{selectedSenior.workExperience} years</span>
                      </div>
                      {selectedSenior.companySector && (
                        <div>
                          <span className="text-sm text-gray-600">Sector:</span>
                          <span className="ml-2 font-medium">{selectedSenior.companySector}</span>
                        </div>
                      )}
                      {selectedSenior.designation && (
                        <div>
                          <span className="text-sm text-gray-600">Designation:</span>
                          <span className="ml-2 font-medium">{selectedSenior.designation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold">
                    Request Connection
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Send a connection request to this senior
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to V2</h3>
                <p className="text-gray-600">
                  Select a senior from the list to view their complete profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

