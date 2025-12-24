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
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center">
          Why Choose <span className="text-primary">Master List</span>?
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center mb-6 md:mb-8">
          Probability-based insights from publicly available alumni admission data
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                {feature.number}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

