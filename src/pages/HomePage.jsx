import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRIMARY_PRODUCTS } from '../data/mockProducts';

export default function HomePage({ searchQuery }) {
  const filtered = searchQuery
    ? PRIMARY_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PRIMARY_PRODUCTS;

  return (
    <div className="bg-amazon-gray-bg min-h-screen">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-r from-amazon-navy via-amazon-navy-light to-amazon-navy overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-white z-10">
            <span className="inline-block bg-amazon-orange text-amazon-navy-dark text-xs font-bold px-2 py-1 rounded mb-3">
              HackOnAmazon 2026
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Shop smarter with <span className="text-amazon-orange">Prism</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-lg mb-4">
              AI-powered reverse logistics — returns graded by Ollama, relisted instantly on Prism Renewed.
              Save ₹400+ margin per return for sellers like Meena.
            </p>
            <div className="flex gap-3">
              <Link to="/marketplace" className="amazon-btn-primary px-6 py-2">
                Shop Prism Renewed
              </Link>
              <Link to="/supplier" className="border border-white text-white rounded-full px-6 py-2 text-sm hover:bg-white/10 transition-colors">
                Seller Dashboard
              </Link>
            </div>
          </div>
          <div className="hidden md:block w-72 h-40 bg-amazon-orange/20 rounded-lg border border-amazon-orange/40 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl font-bold text-amazon-orange">30→3</div>
              <div className="text-sm text-gray-300">min per return processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="bg-white rounded-sm shadow-amazon p-4 mb-4">
          <h2 className="text-lg font-bold text-amazon-navy-dark mb-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'Electronics & Accessories'}
          </h2>
          <div className="flex gap-3 overflow-x-auto prism-scroll pb-1">
            {['All', 'Earbuds', 'Smart Watches', 'Mice', 'Storage', 'Cables'].map((cat) => (
              <button
                key={cat}
                type="button"
                className="shrink-0 px-4 py-1.5 border border-gray-300 rounded-full text-sm hover:border-amazon-orange hover:text-amazon-orange transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid — Amazon style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No products found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Prism CTA strip */}
      <div className="max-w-[1500px] mx-auto px-4 pb-8">
        <div className="bg-white rounded-sm shadow-amazon p-6 flex flex-col md:flex-row items-center gap-4 border-l-4 border-amazon-orange">
          <div className="flex-1">
            <h3 className="font-bold text-lg">Returning an item?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Sellers use Prism to auto-grade, route, and relist returns — no 40-minute manual inspection.
            </p>
          </div>
          <Link to="/supplier#inspect" className="amazon-btn-primary px-6 py-2 whitespace-nowrap">
            Open Inspection Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
