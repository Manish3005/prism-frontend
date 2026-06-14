import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  Globe,
} from 'lucide-react';

export default function AmazonHeader({ searchQuery, onSearchChange, onSearchSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
    if (location.pathname !== '/') navigate('/');
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Primary nav — Amazon dark navy */}
      <div className="bg-amazon-navy text-white">
        <div className="max-w-[1500px] mx-auto px-3 flex items-center gap-2 h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-end gap-0.5 shrink-0 px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded-sm">
            <span className="text-2xl font-bold tracking-tight text-white">amazon</span>
            <span className="text-amazon-orange text-xs mb-1">.in</span>
          </Link>

          {/* Deliver to */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded-sm cursor-pointer shrink-0">
            <MapPin size={18} className="text-gray-300" />
            <div className="text-xs leading-tight">
              <div className="text-gray-300">Deliver to</div>
              <div className="font-bold">Chennai 600001</div>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-3xl mx-2">
            <select className="hidden sm:block bg-amazon-gray-bg text-amazon-gray text-xs px-2 rounded-l-md border-0 border-r border-gray-300 h-10">
              <option>All</option>
              <option>Electronics</option>
              <option>Wearables</option>
            </select>
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search Amazon.in"
              className="flex-1 px-4 h-10 text-amazon-navy-dark text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-amazon-orange hover:bg-amazon-orange-dark px-4 rounded-r-md h-10 flex items-center"
            >
              <Search size={20} className="text-amazon-navy-dark" />
            </button>
          </form>

          {/* Language */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded-sm cursor-pointer text-sm">
            <Globe size={16} />
            <span>EN</span>
            <ChevronDown size={14} />
          </div>

          {/* Account */}
          <Link
            to="/supplier"
            className="hidden sm:block px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded-sm text-xs leading-tight"
          >
            <div className="text-gray-300">Hello, Meena</div>
            <div className="font-bold flex items-center gap-0.5">
              Supplier Hub <ChevronDown size={12} />
            </div>
          </Link>

          {/* Returns & Orders */}
          <Link
            to="/supplier"
            className="hidden md:block px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded-sm text-xs leading-tight"
          >
            <div className="text-gray-300">Returns</div>
            <div className="font-bold">& Orders</div>
          </Link>

          {/* Cart */}
          <Link
            to="/checkout-nudge"
            className="flex items-end gap-1 px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded-sm relative"
          >
            <ShoppingCart size={28} />
            <span className="font-bold text-sm mb-0.5">Cart</span>
            <span className="absolute top-1 left-5 bg-amazon-orange text-amazon-navy-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="bg-amazon-navy-light text-white text-sm">
        <div className="max-w-[1500px] mx-auto px-3 flex items-center gap-4 h-9 overflow-x-auto prism-scroll">
          <button type="button" className="flex items-center gap-1 shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm">
            <Menu size={18} /> All
          </button>
          <Link to="/" className="shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm">
            Today&apos;s Deals
          </Link>
          <Link to="/marketplace" className="shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm font-semibold text-amazon-orange">
            Prism Renewed
          </Link>
          <Link
  to="/supplier"
  className="shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm"
>
  Supplier Hub
</Link>

<Link
  to="/marketplace"
  className="shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm"
>
  Marketplace
</Link>



<Link
  to="/camera-inspection"
  className="shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm"
>
  Camera Inspection
</Link>

<Link
  to="/supplier#logs"
  className="shrink-0 hover:outline hover:outline-1 hover:outline-white px-1 rounded-sm"
>
  Pipeline Logs
</Link>
          <span className="shrink-0 text-amazon-orange font-medium ml-auto hidden lg:inline">
            ⚡ Powered by Prism — Intelligent Reverse Logistics
          </span>
        </div>
      </div>
    </header>
  );
}
