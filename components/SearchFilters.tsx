interface SearchFiltersProps {
  college: string;
  bachelorsBranch?: string;
  mastersPrograms?: string[];
  courses?: string[]; // Backward compatibility
  workExperience: number;
  cgpa: number;
}

export default function SearchFilters({
  college,
  bachelorsBranch,
  mastersPrograms,
  courses,
  workExperience,
  cgpa,
}: SearchFiltersProps) {
  const programs = mastersPrograms || courses || [];
  const branch = bachelorsBranch || courses?.[0] || 'N/A';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College
          </label>
          <div className="text-gray-900">{college}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bachelor's Branch
          </label>
          <div className="text-gray-900">{branch}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Experience
          </label>
          <div className="text-gray-900">{workExperience} years</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CGPA
          </label>
          <div className="text-gray-900">{cgpa}/10</div>
        </div>
        {programs.length > 0 && (
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Master's Program(s)
            </label>
            <div className="flex flex-wrap gap-2">
              {programs.map((program, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                >
                  {program}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

