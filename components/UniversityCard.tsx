interface UniversityCardProps {
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

export default function UniversityCard({
  university,
  course,
  location,
  matchPercentage,
  alumniCount,
  admittedYearRange,
}: UniversityCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {university}
          </h3>
          {course && (
            <p className="text-gray-600 text-sm mb-1">{course}</p>
          )}
          {location && (
            <p className="text-gray-500 text-sm">{location}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(
            matchPercentage
          )}`}
        >
          {matchPercentage}% match
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
        <span>{alumniCount} similar profile{alumniCount !== 1 ? 's' : ''}</span>
        {admittedYearRange.min && (
          <span>
            Admitted: {admittedYearRange.min}
          </span>
        )}
      </div>
    </div>
  );
}

