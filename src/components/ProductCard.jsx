import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatINR, renderStars } from '../data/mockProducts';

export default function ProductCard({ product, linkPrefix = '/product' }) {
  const { full, half } = renderStars(product.rating);
  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Link
      to={`${linkPrefix}/${product.id || product.asin}`}
      className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-amazon transition-shadow flex flex-col h-full group"
    >
      <div className="relative aspect-square mb-3 overflow-hidden bg-white flex items-center justify-center">
        <img
          src={product.image}
          alt={product.shortName || product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        {product.condition_grade && (
          <span className="absolute top-0 left-0 prism-badge bg-green-700 text-white">
            {product.condition_grade.replace('_', ' ')}
          </span>
        )}
      </div>

      <h3 className="text-sm text-amazon-navy-dark line-clamp-2 mb-2 leading-snug group-hover:text-amazon-red">
        {product.shortName || product.name}
      </h3>

      <div className="flex items-center gap-1 mb-1">
        <div className="flex">
          {Array.from({ length: full }).map((_, i) => (
            <Star key={`f${i}`} size={14} className="fill-amazon-orange text-amazon-orange" />
          ))}
          {half && <Star size={14} className="fill-amazon-orange/50 text-amazon-orange" />}
        </div>
        <span className="text-amazon-link text-xs hover:underline">
          {product.reviewCount?.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <span className="text-xs align-super">₹</span>
          <span className="text-xl font-normal">
            {(product.resale_price || product.price)?.toLocaleString('en-IN')}
          </span>
        </div>
        {product.mrp && (
          <div className="text-xs text-gray-500">
            M.R.P.: <span className="line-through">{formatINR(product.mrp)}</span>
            {discount > 0 && (
              <span className="text-amazon-red ml-1">({discount}% off)</span>
            )}
          </div>
        )}
        {product.prime && (
          <div className="mt-1">
            <span className="text-amazon-blue font-bold text-xs italic">prime</span>
          </div>
        )}
        {product.delivery && (
          <p className="text-xs text-gray-700 mt-1">{product.delivery}</p>
        )}
      </div>
    </Link>
  );
}
