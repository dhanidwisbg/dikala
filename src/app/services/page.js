export const metadata = {
  title: 'Services & Pricing',
  description: 'Transparent pricing for premium photography experiences by DIKALA Photography.',
};

const packages = [
  {
    name: 'Sendiri',
    price: 'Rp.250.000',
    features: ['1 Hours Session', '25 High-Res Edits', 'Unlimited Shots', 'Second Shooter'],
  },
  {
    name: 'Berdua',
    price: 'Rp.300.000',
    features: ['1 Hour Session', '30 High-Res Edits', 'Unlimited Shots', 'Second Shooter'],
  },
  {
    name: 'Sekeluarga',
    price: 'Rp.350.000',
    features: ['1 Hours Session', '40 High-Res Edits', 'Unlimited Shots', 'Second Shooter'],
  },
];

export default function ServicesPage() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-white text-sm uppercase tracking-widest font-bold mb-2 block">
          Investment
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">Services &amp; Pricing</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Transparent pricing for premium photography experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="bg-gray-900 border border-gray-800 p-8 rounded-sm hover:border-white transition-colors duration-300 relative group"
          >
            <h3 className="font-serif text-2xl text-white mb-2">{pkg.name}</h3>
            <p className="text-white text-3xl font-bold mb-6">{pkg.price}</p>
            <ul className="text-gray-400 space-y-4 mb-8 text-sm">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-white">✓</span> {feature}
                </li>
              ))}
            </ul>
            <a
              href="https://linktr.ee/dikala.mdn"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 border border-gray-600 text-white text-center rounded-sm hover:bg-white hover:border-white hover:text-black transition-all uppercase text-xs tracking-widest font-bold"
            >
              Book Now
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
