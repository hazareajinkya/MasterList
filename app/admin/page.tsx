'use client';

import { useEffect, useState } from 'react';

interface WaitlistEmail {
  id: string;
  email: string;
  createdAt: string;
}

interface MatchResult {
  id: string;
  userCGPA: number;
  userWorkEx: number;
  userBranch: string;
  userCollege: string;
  userCourses: string[];
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [waitlistEmails, setWaitlistEmails] = useState<WaitlistEmail[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'waitlist' | 'searches'>('waitlist');

  // Check if already authenticated
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'waitlist') {
        const response = await fetch('/api/admin/waitlist');
        if (response.ok) {
          const data = await response.json();
          setWaitlistEmails(data);
        }
      } else {
        const response = await fetch('/api/admin/searches');
        if (response.ok) {
          const data = await response.json();
          setMatchResults(data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when authenticated and tab changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        fetchData();
      } else {
        setError(data.error || 'Invalid password');
        setLoading(false);
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-6">Enter password to access admin dashboard</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('waitlist')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'waitlist'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Waitlist Emails ({waitlistEmails.length})
              </button>
              <button
                onClick={() => setActiveTab('searches')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'searches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Searches ({matchResults.length})
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Waitlist Tab */}
              {activeTab === 'waitlist' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Waitlist Emails ({waitlistEmails.length})
                    </h2>
                    <button
                      onClick={fetchData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Refresh
                    </button>
                  </div>

                  {waitlistEmails.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No emails in waitlist yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Signed Up
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {waitlistEmails.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Searches Tab */}
              {activeTab === 'searches' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      User Search Queries ({matchResults.length})
                    </h2>
                    <button
                      onClick={fetchData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Refresh
                    </button>
                  </div>

                  {matchResults.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No search queries recorded yet.</p>
                      <p className="mt-2 text-sm">
                        Searches will appear here once the match API is updated to save queries.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matchResults.map((result) => (
                        <div
                          key={result.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">College</p>
                              <p className="font-medium text-gray-900">{result.userCollege}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Branch</p>
                              <p className="font-medium text-gray-900">{result.userBranch}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">CGPA</p>
                              <p className="font-medium text-gray-900">{result.userCGPA}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Work Experience</p>
                              <p className="font-medium text-gray-900">{result.userWorkEx} years</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500 uppercase">Master's Programs</p>
                              <p className="font-medium text-gray-900">
                                {result.userCourses.join(', ')}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500 uppercase">Searched At</p>
                              <p className="text-sm text-gray-600">{formatDate(result.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

