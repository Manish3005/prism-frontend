import { useNavigate } from 'react-router-dom';

const roles = [
  { key: 'customer', label: 'Customer',     icon: '🛒', sub: 'Browse and shop products' },
  { key: 'vendor',   label: 'Vendor',       icon: '📦', sub: 'Manage listings & supply' },
  { key: 'admin',    label: 'Amazon Admin', icon: '🛡️', sub: 'Platform oversight & controls' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL — 50% dark Amazon promo */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-amazon-navy px-12 py-14">

        <div>
          <span className="text-4xl font-bold text-white tracking-tight">amazon</span>
          <span className="text-amazon-orange text-4xl font-bold">.in</span>
        </div>

        <div>
          <div className="inline-block bg-amazon-orange text-amazon-navy-dark text-xs font-bold px-4 py-1.5 rounded mb-6 tracking-widest uppercase">
            Summer Sale 2024
          </div>
          <h2 className="text-white text-5xl font-bold leading-tight mb-5">
            Up to 70% off<br />
            on top brands
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-sm">
            Electronics, fashion, home essentials and more — all at unbeatable prices. Shop millions of deals, only on Amazon.in.
          </p>

          <div className="flex flex-col gap-4">
            {['Free delivery on orders above ₹499', 'No-cost EMI on select products', 'Easy 30-day returns'].map(f => (
              <div key={f} className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-amazon-orange shrink-0" />
                <span className="text-gray-300 text-base">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm">© 2024 Amazon Prism · Intelligent Reverse Logistics</p>
      </div>

      {/* RIGHT PANEL — 50% white, role selection */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-12 py-12">

        {/* Mobile logo */}
        <div className="md:hidden mb-8 text-center">
          <span className="text-4xl font-bold text-amazon-navy-dark tracking-tight">amazon</span>
          <span className="text-amazon-orange text-4xl font-bold">.in</span>
        </div>

        <h1 className="text-3xl font-bold text-amazon-navy-dark mb-2 w-full">Sign in</h1>
        <p className="text-amazon-gray text-base mb-10 w-full">Choose your account type</p>

        <div className="flex flex-col gap-4 w-full">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => navigate(`/login?role=${role.key}`)}
              className="flex items-center gap-5 bg-amazon-navy border-2 border-amazon-navy-light rounded-xl px-6 py-5 text-left hover:border-amazon-orange transition-all group"
            >
              <span className="text-3xl">{role.icon}</span>
              <div>
                <div className="text-lg font-bold text-white group-hover:text-amazon-orange">
                  {role.label}
                </div>
                <div className="text-gray-400 text-sm">{role.sub}</div>
              </div>
              <span className="ml-auto text-gray-500 group-hover:text-amazon-orange text-2xl">›</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}