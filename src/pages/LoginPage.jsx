import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const roleConfig = {
  customer: { label: 'Customer',     redirect: '/home' },
  vendor:   { label: 'Vendor',       redirect: '/supplier' },
  admin:    { label: 'Amazon Admin', redirect: '/amazon-admin' },
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role   = searchParams.get('role') || 'customer';
  const config = roleConfig[role] || roleConfig.customer;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    navigate(config.redirect);
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT — 50% dark panel */}
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
            Millions of deals.<br />
            One sign-in.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
            Access your personalized Amazon experience — shop, sell, or manage the platform from one place.
          </p>
        </div>

        <p className="text-gray-600 text-sm">© 2024 Amazon Prism · Intelligent Reverse Logistics</p>
      </div>

      {/* RIGHT — 50% white login form */}
      <div className="flex-1 bg-white flex flex-col justify-center pl-16 pr-8 py-12">

        {/* Mobile logo */}
        <div className="md:hidden mb-8 text-center cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-4xl font-bold text-amazon-navy-dark tracking-tight">amazon</span>
          <span className="text-amazon-orange text-4xl font-bold">.in</span>
        </div>

        <h1 className="text-3xl font-bold text-amazon-navy-dark mb-1">
          Welcome back
        </h1>
        <p className="text-amazon-gray text-base mb-10">
          Signing in as <span className="font-semibold text-amazon-gray">{config.label}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div>
            <label className="block text-base font-semibold text-amazon-navy-dark mb-2">
              Email or mobile number
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter email or mobile"
              className="w-3/4 bg-white border-2 border-gray-300 text-amazon-navy-dark placeholder-gray-400 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-amazon-orange focus:ring-2 focus:ring-amazon-orange"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-amazon-navy-dark mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              className="w-3/4 bg-white border-2 border-gray-300 text-amazon-navy-dark placeholder-gray-400 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-amazon-orange focus:ring-2 focus:ring-amazon-orange"
            />
            <p className="text-right w-3/4 mt-2">
              <span className="text-amazon-orange text-sm font-semibold cursor-pointer hover:underline">
                Forgot password?
              </span>
            </p>
          </div>

          {error && (
            <p className="text-amazon-red text-sm border border-amazon-red rounded-xl px-4 py-3 bg-red-50 w-3/4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-3/4 bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-navy-dark text-base font-bold py-3.5 rounded-xl border border-yellow-400 transition-colors"
          >
            Continue →
          </button>
        </form>
        <div className="w-3/4 flex justify-center mt-4">
  <button
    type="button"
    onClick={() => navigate("/signup")}
  >
    <span className="text-black">New User? </span>
    <span className="text-[#FF9900] font-semibold">
      Create Account
    </span>
  </button>
</div>
        <p className="mt-6 text-xs text-amazon-gray w-3/4 leading-relaxed">
          By continuing, you agree to Amazon's{' '}
          <span className="text-amazon-orange cursor-pointer hover:underline">Conditions of Use</span>
          {' '}and{' '}
          <span className="text-amazon-orange cursor-pointer hover:underline">Privacy Notice</span>.
        </p>

        
      </div>

    </div>
  );
}