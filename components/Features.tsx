export default function Features() {
  const features = [
    {
      number: '1',
      title: 'Alumni Data',
      description: 'View probability-based matches from public admission data of past alumni',
    },
    {
      number: '2',
      title: 'Personalized Matches',
      description: 'Get probability scores based on your college, course, and profile background',
    },
    {
      number: '3',
      title: 'Admission Insights',
      description: 'See probability-based insights on admission patterns from historical data',
    },
    {
      number: '4',
      title: 'Data-Driven Results',
      description: 'All results are probability-based and derived from publicly available sources',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          Why Choose <span className="text-primary">Master List</span>?
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Probability-based insights from publicly available alumni admission data
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                {feature.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

