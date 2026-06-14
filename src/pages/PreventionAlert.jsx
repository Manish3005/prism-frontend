import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  Ruler,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { PRIMARY_PRODUCTS, formatINR } from '../data/mockProducts';

/**
 * PreventionAlert — Checkout nudge mockup.
 * Demonstrates proactive return prevention before purchase (HackOnAmazon angle).
 */
export default function PreventionAlert() {
  const [showNudge, setShowNudge] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  const cartItems = [
    { ...PRIMARY_PRODUCTS[0], qty: 1 },
    { ...PRIMARY_PRODUCTS[1], qty: 1 },
  ];

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleProceed = () => {
    if (!selectedSize) {
      setShowNudge(true);
      return;
    }
    setAcknowledged(true);
    setShowNudge(false);
  };

  return (
    <div className="bg-amazon-gray-bg min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-amazon-navy-dark mb-2">Shopping Cart</h1>
        <p className="text-sm text-gray-600 mb-6">
          Checkout with Prism Purchase Protection — AI-powered fit & return prevention
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-sm shadow-amazon p-4 flex gap-4 border border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.shortName}
                  className="w-24 h-24 object-contain shrink-0"
                />
                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="text-sm amazon-link font-medium line-clamp-2">
                    {item.shortName}
                  </Link>
                  <p className="text-xs text-green-700 mt-1">{item.delivery}</p>
                  {item.id === 'prod_002' && (
                    <div className="mt-2">
                      <label className="text-xs font-bold block mb-1">Wrist Size</label>
                      <select
                        value={selectedSize}
                        onChange={(e) => {
                          setSelectedSize(e.target.value);
                          if (e.target.value) setShowNudge(false);
                        }}
                        className="border border-gray-400 rounded-sm px-2 py-1 text-sm"
                      >
                        <option value="">Select size...</option>
                        <option value="small">Small (140–160mm)</option>
                        <option value="medium">Medium (160–180mm)</option>
                        <option value="large">Large (180–200mm)</option>
                      </select>
                    </div>
                  )}
                  <p className="font-bold mt-2">{formatINR(item.price)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-amazon p-5 sticky top-24">
              <p className="text-sm text-gray-600">
                Subtotal ({cartItems.length} items):
              </p>
              <p className="text-2xl font-bold mt-1 mb-4">{formatINR(cartTotal)}</p>

              <button
                type="button"
                onClick={handleProceed}
                className="w-full amazon-btn-primary py-2.5 text-base mb-3"
              >
                Proceed to Buy
              </button>

              {acknowledged && (
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded p-3">
                  <CheckCircle size={16} />
                  Fit verified — return risk reduced by 67%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prism prevention nudge modal */}
        {showNudge && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-amazon-orange to-amber-500 px-5 py-4 flex items-start justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles size={22} />
                  <div>
                    <p className="font-bold text-base">Prism Fit Alert</p>
                    <p className="text-xs opacity-90">Purchase Protection Nudge</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNudge(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={22} />
                  <div>
                    <p className="font-bold text-amazon-navy-dark">
                      38% of smart watch returns cite wrong wrist size
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on Prism analytics for Noise ColorFit Pulse 2 Max in your pincode (600001),
                      selecting the correct wrist size reduces return probability significantly.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-2">
                    <Ruler size={16} />
                    Quick Wrist Measurement
                  </div>
                  <p className="text-xs text-blue-700">
                    Wrap a tape measure around your wrist bone. Medium (160–180mm) fits 62% of buyers in Chennai.
                  </p>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="mt-2 w-full border border-blue-300 rounded-sm px-3 py-2 text-sm"
                  >
                    <option value="">Select your wrist size...</option>
                    <option value="small">Small (140–160mm)</option>
                    <option value="medium">Medium (160–180mm) — Most common</option>
                    <option value="large">Large (180–200mm)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Shield size={14} className="text-amazon-orange" />
                  Powered by Prism — prevents costly reverse logistics before they happen
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSize) {
                        setShowNudge(false);
                        setAcknowledged(true);
                      }
                    }}
                    disabled={!selectedSize}
                    className="flex-1 amazon-btn-primary py-2 disabled:opacity-50"
                  >
                    Confirm & Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNudge(false)}
                    className="flex-1 amazon-btn-secondary py-2"
                  >
                    Skip (higher return risk)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational footer */}
        <div className="mt-8 bg-white rounded-sm shadow-amazon p-5 border-l-4 border-amazon-orange">
          <h3 className="font-bold mb-2">HackOnAmazon Demo: Prevention vs. Cure</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-amazon-orange mb-1">🛡️ Prevention (this page)</p>
              <p>AI nudge at checkout reduces return rate — saves seller margin before reverse logistics kicks in.</p>
            </div>
            <div>
              <p className="font-semibold text-green-700 mb-1">♻️ Cure (Supplier Dashboard)</p>
              <p>
                When returns happen, Prism auto-grades via Ollama, calculates net recovery, and relists on{' '}
                <Link to="/marketplace" className="amazon-link">Prism Renewed</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
