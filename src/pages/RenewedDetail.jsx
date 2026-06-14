import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Shield, Truck, Leaf } from 'lucide-react';
import HealthCard from '../components/HealthCard';
import { fetchMarketplaceListings } from '../api/bridgeApi';
import { MARKETPLACE_LISTINGS, formatINR, renderStars } from '../data/mockProducts';

export default function RenewedDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    fetchMarketplaceListings()
      .then((items) => {
        const found = items.find((l) => l.id === id || l._id === id);
        setListing(found || MARKETPLACE_LISTINGS.find((l) => l.id === id || l._id === id));
      })
      .catch(() => {
        setListing(MARKETPLACE_LISTINGS.find((l) => l.id === id || l._id === id));
      });
  }, [id]);

  if (!listing) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
        <Link to="/marketplace" className="amazon-link">Back to Prism Renewed</Link>
      </div>
    );
  }

  const { full, half } = renderStars(listing.rating || 4.0);
  const savings = listing.original_value - listing.resale_price;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-green-700 text-white text-xs py-1.5 text-center font-medium">
        <Leaf size={12} className="inline mr-1" />
        Prism Renewed — AI Verified · Ollama Graded · In-Place Relist
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="border border-green-200 rounded-sm p-8 w-full max-w-lg flex items-center justify-center relative">
              <img src={listing.image} alt={listing.name} className="max-h-96 object-contain" />
              <span className="absolute top-3 left-3 prism-badge bg-green-700 text-white">
                {(listing.condition_grade || listing.ai_grading?.condition_grade || '').replace('_', ' ')}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-normal leading-snug mb-2">{listing.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {Array.from({ length: full }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amazon-orange text-amazon-orange" />
                ))}
                {half && <Star size={16} className="fill-amazon-orange/50 text-amazon-orange" />}
              </div>
              <span className="text-amazon-link text-sm">{listing.reviewCount || 5} Prism reviews</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 text-sm">
              <p className="text-green-800 font-bold">
                You save {formatINR(savings)} vs buying new
              </p>
              <p className="text-green-700 text-xs mt-1">
                Original M.R.P. {formatINR(listing.original_value)} · {listing.ai_grading?.suggested_depreciation_percentage}% depreciation applied
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-sm">₹</span>
                <span className="text-4xl">{listing.resale_price?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amazon-green mb-4">
              <Truck size={16} />
              FREE delivery · Ships from seller ZIP {listing.seller_zipcode}
            </div>

            <div className="flex items-center gap-2 text-sm mb-6">
              <Shield size={16} className="text-amazon-orange" />
              <span>Includes Prism Product Health Certificate</span>
            </div>

            <button type="button" className="w-full amazon-btn-primary py-2.5 text-base mb-3">
              Add to Cart
            </button>
            <Link to="/marketplace" className="block text-center amazon-link text-sm">
              ← Back to all Renewed listings
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="text-amazon-orange" />
            Verified Product Health Certificate
          </h2>
          <HealthCard card={listing} />
        </div>
      </div>
    </div>
  );
}
