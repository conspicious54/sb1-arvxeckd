import { DollarSign, Users, Gift, Star } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      label: "Average Monthly Earnings",
      value: "$200-500",
      description: "Active users earn consistently",
      icon: <DollarSign className="w-6 h-6" />,
      color: "blue"
    },
    {
      label: "Total Community",
      value: "50,000+",
      description: "Growing user base worldwide",
      icon: <Users className="w-6 h-6" />,
      color: "green"
    },
    {
      label: "Available Rewards",
      value: "25+",
      description: "Gift cards and cash options",
      icon: <Gift className="w-6 h-6" />,
      color: "purple"
    },
    {
      label: "User Satisfaction",
      value: "4.9/5",
      description: "Based on 15,000+ reviews",
      icon: <Star className="w-6 h-6" />,
      color: "yellow"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Over 50,000 Users
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join our growing community of earners and start making money today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`p-4 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-2xl mx-auto w-fit mb-6`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {stat.label}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}