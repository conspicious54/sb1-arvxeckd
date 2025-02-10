import { CreditCard, DollarSign, Gift, Gamepad, Plane } from 'lucide-react';

export function RewardsSection() {
  const rewards = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Gift Cards",
      description: "Amazon, Visa, Target, and more",
      amount: "$10-100",
      color: "blue"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "PayPal Cash",
      description: "Direct to your PayPal account",
      amount: "$5-500",
      color: "green"
    },
    {
      icon: <Gamepad className="w-8 h-8" />,
      title: "Gaming",
      description: "Steam, PlayStation, Xbox",
      amount: "$10-50",
      color: "purple"
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Travel",
      description: "Airbnb, Hotels.com",
      amount: "$25-200",
      color: "pink"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Rewards
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Multiple redemption options to suit your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rewards.map((reward) => (
            <div
              key={reward.title}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`p-4 bg-${reward.color}-100 dark:bg-${reward.color}-900/30 rounded-2xl mx-auto w-fit mb-6`}>
                {reward.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {reward.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {reward.description}
              </p>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {reward.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}