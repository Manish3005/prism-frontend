import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Leaf, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HealthCard from '../components/HealthCard';
import { fetchMarketplaceListings } from '../api/bridgeApi';
import { MARKETPLACE_LISTINGS, formatINR } from '../data/mockProducts';

export default function Marketplace() {
  const [listings, setListings] = useState(MARKETPLACE_LISTINGS);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaceListings()
      .then(setListings)
      .catch(() => setListings(MARKETPLACE_LISTINGS))
      .finally(() => setLoading(false));
  }, []);

  const cardListings = listings.map((l) => ({
    ...l,
    id: l.id || l._id,
    price: l.resale_price,
    shortName: l.name,
    rating: l.rating || 4.0,
    reviewCount: l.reviewCount || 5,
    mrp: l.original_value,
    prime: l.prime,
    delivery: 'FREE delivery · Ships from seller location',
  }));

  return (
    <div className="bg-amazon-gray-bg min-h-screen">
      {/* Marketplace hero */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Leaf size={28} />
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">
              Secondary Resale
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Prism Renewed Marketplace</h1>
          <p className="text-green-100 max-w-2xl text-sm">
            Verified graded stock from AI-inspected returns. Each listing includes a cryptographic
            Product Health Card — graded locally by Ollama, routed by profitability engine, listed instantly.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Shield size={16} />
              <span>AI Verified Grading</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Star size={16} />
              <span>Up to 40% off M.R.P.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Info strip */}
        <div className="bg-white rounded-sm shadow-amazon p-4 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 border-l-4 border-green-600">
          <div className="flex-1">
            <h2 className="font-bold">For buyers like Rahul</h2>
            <p className="text-sm text-gray-600 mt-1">
              Every Prism Renewed item passed Ollama condition grading with a published Health Card.
              Net recovery-positive items are relisted in-place — no warehouse middleman.
            </p>
          </div>
          <Link to="/supplier#inspect" className="amazon-btn-primary whitespace-nowrap px-5 py-2">
            Seller? Submit a Return
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading verified listings...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product grid */}
            <div className="lg:col-span-2">
              <h2 className="font-bold text-lg mb-4">
                {listings.length} Verified Listings
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cardListings.map((listing) => (
                  <div key={listing.id} className="relative">
                    <ProductCard product={listing} linkPrefix="/renewed" />
                    <button
                      type="button"
                      onClick={() => setSelectedCard(listing)}
                      className="absolute bottom-14 left-2 right-2 text-xs bg-amazon-navy text-white py-1 rounded opacity-0 hover:opacity-100 transition-opacity"
                    >
                      View Health Card
                    </button>
                    <div className="mt-1 px-1">
                      <p className="text-xs text-green-700 font-medium">
                        Save {formatINR(listing.original_value - listing.resale_price)} vs new
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health card sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-amazon-orange" />
                  Product Health Certificate
                </h2>
                {selectedCard ? (
                  <HealthCard card={selectedCard} />
                ) : (
                  <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">
                    <Shield size={32} className="mx-auto mb-3 text-gray-300" />
                    Click &quot;View Health Card&quot; on any listing to inspect the AI grading certificate
                  </div>
                )}

                {/* Default show first listing card */}
                {!selectedCard && listings[0] && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Featured certificate:</p>
                    <HealthCard card={listings[0]} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
