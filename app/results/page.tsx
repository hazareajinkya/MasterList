'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import UniversityCard from '@/components/UniversityCard';
import EmailWaitlist from '@/components/EmailWaitlist';
import Link from 'next/link';

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
}

interface SearchParams {
  college: string;
  bachelorsBranch?: string;
  mastersPrograms?: string[];
  courses?: string[]; // Backward compatibility
  workExperience: number;
  cgpa: number;
  tenthPercentage?: number | null;
  twelfthPercentage?: number | null;
  companyName?: string | null;
  companySector?: string | null;
  designation?: string | null;
  researchPapers?: number | null;
  publications?: string | null;
}

export default function Results() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [universities, setUniversities] = useState<MatchedUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get search params from sessionStorage
    const stored = sessionStorage.getItem('searchParams');
    if (!stored) {
      router.push('/find-seniors');
      return;
    }

    try {
      const params: SearchParams = JSON.parse(stored);
      setSearchParams(params);
      fetchMatches(params);
    } catch (err) {
      setError('Invalid search parameters');
      setLoading(false);
    }
  }, [router]);

  const fetchMatches = async (params: SearchParams) => {
    try {
      setLoading(true);
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (response.ok) {
        setUniversities(data.universities || []);
      } else {
        setError(data.error || 'Failed to fetch matches');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-primary mx-auto mb-4"
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
              <p className="text-gray-600">Finding your matches...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !searchParams) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error || 'No search parameters found'}</p>
            <Link
              href="/find-seniors"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Go back to search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/find-seniors"
          className="text-primary hover:text-primary-dark mb-6 inline-block"
        >
          ← Back to Search
        </Link>

        <SearchFilters
          college={searchParams.college}
          bachelorsBranch={searchParams.bachelorsBranch}
          mastersPrograms={searchParams.mastersPrograms}
          courses={searchParams.courses}
          workExperience={searchParams.workExperience}
          cgpa={searchParams.cgpa}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Probability-Based Matches from {searchParams.college}
          </h1>
          <p className="text-gray-600">
            {universities.length} match{universities.length !== 1 ? 'es' : ''} found
          </p>
        </div>

        {universities.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later as we add more alumni data.
            </p>
            <Link
              href="/find-seniors"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Modify Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {universities.map((uni, index) => (
              <UniversityCard key={index} {...uni} />
            ))}
          </div>
        )}

        <EmailWaitlist />
      </div>
    </div>
  );
}

