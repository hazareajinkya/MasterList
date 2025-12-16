import Header from '@/components/Header';
import Link from 'next/link';
import EmailWaitlist from '@/components/EmailWaitlist';

export default function About() {
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

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">How to Use Master List</h1>
          
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <div>
                <p className="font-medium mb-1">Enter your profile details</p>
                <p className="text-gray-600 text-sm">Select your college, desired courses, work experience, and CGPA</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <div>
                <p className="font-medium mb-1">Get probability-based matches</p>
                <p className="text-gray-600 text-sm">View probability-based matches from publicly available alumni admission data</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <div>
                <p className="font-medium mb-1">Sign up for v2</p>
                <p className="text-gray-600 text-sm">Get early access to enhanced probability-based matching with more detailed data insights</p>
              </div>
            </li>
          </ol>
        </div>

        <EmailWaitlist />
      </div>
    </div>
  );
}

