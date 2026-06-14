import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { getProductById, formatINR, renderStars } from '../data/mockProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="amazon-link">Back to Amazon.in</Link>
      </div>
    );
  }

  const { full, half } = renderStars(product.rating);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1500px] mx-auto px-4 py-2 text-xs text-amazon-link flex items-center gap-1 flex-wrap">
        <Link to="/" className="hover:underline">Electronics</Link>
        <ChevronRight size={12} />
        <span>{product.category}</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 truncate max-w-xs">{product.shortName}</span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex flex-col items-center">
            <div className="border border-gray-200 rounded-sm p-8 w-full max-w-lg flex items-center justify-center bg-white">
              <img
                src={product.image}
                alt={product.shortName}
                className="max-h-96 object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl font-normal text-amazon-navy-dark leading-snug mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-amazon-link mb-2">
              Visit the <span className="font-bold">{product.brand}</span> Store
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: full }).map((_, i) => (
                  <Star key={i} size={18} className="fill-amazon-orange text-amazon-orange" />
                ))}
                {half && <Star size={18} className="fill-amazon-orange/50 text-amazon-orange" />}
              </div>
              <span className="text-amazon-link text-sm hover:underline cursor-pointer">
                {product.reviewCount.toLocaleString('en-IN')} ratings
              </span>
            </div>

            <hr className="border-gray-200 my-4" />

            <div className="mb-4">
              <span className="text-red-700 text-sm">-{discount}%</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm align-super">₹</span>
                <span className="text-4xl font-normal">{product.price.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-600">
                M.R.P.: <span className="line-through">{formatINR(product.mrp)}</span>
                <span className="text-amazon-green ml-2">Inclusive of all taxes</span>
              </p>
              {product.prime && (
                <p className="mt-2">
                  <span className="text-amazon-blue font-bold italic text-lg">prime</span>
                  <span className="text-sm text-gray-700 ml-2">{product.delivery}</span>
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center gap-2 text-amazon-green">
                <Truck size={16} />
                <span>{product.delivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-amazon-orange" />
                <Link to="/checkout-nudge" className="amazon-link">
                  Amazon Protect — Size/fit nudge at checkout
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-gray-600" />
                <span>10-day Return Policy · Processed by <strong>Prism AI</strong></span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-sm">
                <span className="font-bold">Seller margin:</span>{' '}
                <span className="text-amazon-green font-bold">{formatINR(product.margin)}</span>
                {' '}per unit · Seller: {product.seller} ({product.sellerZipcode})
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              <Link
                to="/checkout-nudge"
                className="flex-1 amazon-btn-primary text-center py-2.5 text-base"
              >
                Add to Cart
              </Link>
              <Link
                to="/checkout-nudge"
                className="flex-1 bg-amazon-orange hover:bg-amazon-orange-dark text-white rounded-full py-2.5 text-center text-base font-medium transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-bold text-sm mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
