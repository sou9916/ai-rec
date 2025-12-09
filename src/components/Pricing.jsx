import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '#',
    priceMonthly: '₹999',
    description: "Perfect for individuals and small teams exploring AI-Rec.",
    features: [
      'Up to 5,000 AI recommendations / month',
      'Basic analytics dashboard',
      'Email support',
      'Access to core AI-Rec APIs',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    priceMonthly: '₹1,999',
    description: 'Best for growing startups & businesses scaling with AI-Rec.',
    features: [
      'Up to 50,000 AI recommendations / month',
      'Advanced analytics + custom insights',
      'Priority email & chat support',
      'Integration with popular CRMs',
      'Early access to new features',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: 'Custom',
    description: 'Dedicated AI-Rec infrastructure & custom integrations for large organisations.',
    features: [
      'Unlimited AI recommendations',
      'Dedicated account manager',
      'On-premise or private cloud deployment',
      'Custom AI model fine-tuning',
      '24/7 premium support',
    ],
    featured: false,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Background gradient blur */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-indigo-200 to-indigo-500 opacity-30"
        />
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-indigo-600">Pricing</h2>
        <p className="mt-2 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Simple plans for AI-Rec
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
        Choose a plan that fits your business needs. Transparent pricing, powerful AI features, and local INR billing.
      </p>

      {/* Pricing grid */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-5xl lg:grid-cols-3 lg:gap-x-8">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? 'relative bg-gray-900 shadow-2xl ring-2 ring-indigo-400'
                : 'bg-white/70 backdrop-blur-md border border-gray-200',
              'rounded-4xl p-8 sm:p-10 transition-all duration-300 hover:scale-[1.02]'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                'text-base font-semibold'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-4xl font-bold tracking-tight'
                )}
              >
                {tier.priceMonthly}
              </span>
              {tier.priceMonthly !== 'Custom' && (
                <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>
                  /month
                </span>
              )}
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm sm:mt-10'
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                'mt-8 block rounded-3xl px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
              )}
            >
              {tier.priceMonthly === 'Custom' ? 'Contact sales' : 'Get started'}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
