import { useState } from 'react';
import {
  ShoppingCart,
  Wrench,
  Recycle,
  Heart,
  Package,
  Star,
  MoveRight,
  Inbox,
} from 'lucide-react';
import { formatINR } from '../../data/mockProducts';

/**
 * Destination buckets shown as sub-tabs.
 */
const DESTINATIONS = [
  {
    key: 'all',
    label: 'All Items',
    icon: Package,
    color: 'text-gray-600',
    activeBg: 'bg-gray-100 border-gray-400 text-gray-800',
  },
  {
    key: 'resale',
    label: 'Resale',
    icon: ShoppingCart,
    color: 'text-green-600',
    activeBg: 'bg-green-50 border-green-500 text-green-800',
  },
  {
    key: 'refurbish',
    label: 'Refurbish',
    icon: Wrench,
    color: 'text-blue-600',
    activeBg: 'bg-blue-50 border-blue-500 text-blue-800',
  },
  {
    key: 'recycle',
    label: 'Recycle',
    icon: Recycle,
    color: 'text-orange-600',
    activeBg: 'bg-orange-50 border-orange-500 text-orange-800',
  },
  {
    key: 'donate',
    label: 'Donate',
    icon: Heart,
    color: 'text-rose-600',
    activeBg: 'bg-rose-50 border-rose-500 text-rose-800',
  },
];

/**
 * Map a condition grade string to a numeric score (0–100) and colour.
 */
function gradeToScore(grade = '') {
  const g = grade.toLowerCase().replace(/[^a-z]/g, '');
  if (g === 'new' || g === 'likenew') return { score: 95, color: 'text-green-600 bg-green-50' };
  if (g === 'openbox') return { score: 80, color: 'text-blue-600 bg-blue-50' };
  if (g === 'refurbished' || g === 'good') return { score: 65, color: 'text-yellow-600 bg-yellow-50' };
  if (g === 'acceptable' || g === 'fair') return { score: 45, color: 'text-orange-600 bg-orange-50' };
  if (g === 'damaged' || g === 'poor') return { score: 20, color: 'text-red-600 bg-red-50' };
  return { score: 60, color: 'text-gray-600 bg-gray-50' };
}

/**
 * Single item row.
 */
function ItemRow({ item, destination, onAction }) {
  const grade =
    item.ai_grading?.condition_grade || item.condition_grade || 'Open_Box';
  const { score, color } = gradeToScore(grade);
  const recovery =
    item.routing?.calculated_net_recovery || item.resale_price || 0;
  const name = item.product_name || item.name || 'Unknown Product';
  const id = item._id || item.id || Math.random().toString(36).slice(2);

  const actions = DESTINATIONS.filter((d) => d.key !== 'all');

  return (
    <tr className="border-b border-gray-100 hover:bg-orange-50/20 transition-colors">
      {/* Product */}
      <td className="px-5 py-4">
        <div className="font-medium text-amazon-navy-dark line-clamp-1">{name}</div>
        <div className="text-xs text-gray-400 font-mono mt-0.5">
          {String(id).slice(0, 18)}…
        </div>
      </td>

      {/* Score */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
            <Star size={11} />
            {score}/100
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {grade.replace(/_/g, ' ')}
        </div>
      </td>

      {/* Recovery */}
      <td className="px-5 py-4 font-bold text-green-700 text-sm">
        {formatINR(recovery)}
      </td>

      {/* Current destination badge */}
      <td className="px-5 py-4">
        {destination ? (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              DESTINATIONS.find((d) => d.key === destination)?.activeBg || ''
            }`}
          >
            {DESTINATIONS.find((d) => d.key === destination)?.label}
          </span>
        ) : (
          <span className="text-xs text-gray-400 italic">Unassigned</span>
        )}
      </td>

      {/* Action buttons */}
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {actions.map(({ key, label, icon: Icon, color: iconColor }) => {
            const isActive = destination === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onAction(id, key)}
                disabled={isActive}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                  ${
                    isActive
                      ? 'opacity-40 cursor-not-allowed border-gray-300 text-gray-400'
                      : `border-gray-300 hover:border-current ${iconColor} hover:bg-gray-50 cursor-pointer`
                  }`}
              >
                <Icon size={12} />
                {label}
              </button>
            );
          })}
        </div>
      </td>
    </tr>
  );
}

/**
 * Empty state for a sub-tab.
 */
function EmptyBucket({ label, icon: Icon, color }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
      <Icon size={40} className={`${color} mb-3 opacity-40`} />
      <p className="font-medium">No items in {label} yet</p>
      <p className="text-sm mt-1">
        Go to <span className="font-semibold">All Items</span> and click{' '}
        <span className="font-semibold">{label}</span> on any product.
      </p>
    </div>
  );
}

/**
 * ItemsTab
 * Props:
 *   items — array of scanned/fetched return items (same shape as SupplierDashboard returns)
 */
export default function ItemsTab({ items = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('all');
  // { [itemId]: 'resale' | 'refurbish' | 'recycle' | 'donate' }
  const [destinations, setDestinations] = useState({});

  const handleAction = (itemId, dest) => {
    setDestinations((prev) => ({ ...prev, [itemId]: dest }));
  };

  // Filter items for the current sub-tab
  const visibleItems =
    activeSubTab === 'all'
      ? items
      : items.filter(
          (item) =>
            destinations[item._id || item.id] === activeSubTab
        );

  const countFor = (key) =>
    key === 'all'
      ? items.length
      : items.filter((item) => destinations[item._id || item.id] === key).length;

  const activeDestConfig = DESTINATIONS.find((d) => d.key === activeSubTab);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-lg">
          <Inbox size={22} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-amazon-navy-dark">Inspected Items</h2>
          <p className="text-sm text-gray-500">
            Camera-recorded items with AI scores — assign each to a destination
          </p>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DESTINATIONS.map(({ key, label, icon: Icon, color, activeBg }) => {
          const isActive = activeSubTab === key;
          const count = countFor(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSubTab(key)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full border text-sm font-semibold transition-all
                ${isActive ? activeBg + ' border-2' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
            >
              <Icon size={14} className={isActive ? '' : color} />
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${isActive ? 'bg-white/60' : 'bg-gray-100 text-gray-500'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-amazon overflow-hidden border border-gray-100">
        {visibleItems.length === 0 ? (
          <EmptyBucket
            label={activeDestConfig?.label || activeSubTab}
            icon={activeDestConfig?.icon || Package}
            color={activeDestConfig?.color || 'text-gray-400'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Recovery Value</th>
                  <th className="px-5 py-3">Destination</th>
                  <th className="px-5 py-3">
                    {activeSubTab === 'all' ? 'Assign To' : (
                      <span className="flex items-center gap-1">
                        <MoveRight size={12} /> Move To
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <ItemRow
                    key={item._id || item.id}
                    item={item}
                    destination={destinations[item._id || item.id] || null}
                    onAction={handleAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary footer */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {DESTINATIONS.filter((d) => d.key !== 'all').map(({ key, label, icon: Icon, color }) => (
            <span key={key} className="flex items-center gap-1">
              <Icon size={12} className={color} />
              {label}: <strong>{countFor(key)}</strong>
            </span>
          ))}
          <span className="ml-auto">
            Unassigned:{' '}
            <strong>
              {items.length - Object.keys(destinations).length}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}