import { useState } from 'react';
import {
  Package,
  TrendingUp,
  IndianRupee,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { formatINR } from '../../data/mockProducts';

/**
 * SupplierHubTab
 * Asset Performance Ledger — the existing returns table from SupplierDashboard,
 * lifted into its own tab component.
 *
 * Props:
 *   returns  — array of return/product objects
 *   health   — { online: bool }
 *   loading  — bool
 *   onRefresh — () => void
 */
export default function SupplierHubTab({ returns = [], health = {}, loading = false, onRefresh }) {
  const totalRecovery = returns.reduce(
    (sum, r) => sum + (r.routing?.calculated_net_recovery || r.resale_price || 0),
    0
  );
  const relistCount = returns.filter(
    (r) => r.routing?.optimal_destination === 'MARKETPLACE_RELIST_IN_PLACE'
  ).length;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: 'Returns Processed',
            value: returns.length,
            color: 'text-blue-600',
          },
          {
            icon: TrendingUp,
            label: 'Relisted In-Place',
            value: relistCount,
            color: 'text-green-600',
          },
          {
            icon: IndianRupee,
            label: 'Total Net Recovery',
            value: formatINR(totalRecovery),
            color: 'text-amazon-orange',
          },
          {
            icon: Clock,
            label: 'Avg Processing',
            value: '~3 min',
            color: 'text-purple-600',
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-sm shadow-amazon p-4 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={18} className={color} />
              <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table header row */}
      <div className="bg-white rounded-sm shadow-amazon overflow-hidden border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-amazon-navy-dark">Asset Performance Ledger</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              All processed returns with AI grading and recovery values
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1 rounded-full border ${
                health.online
                  ? 'border-green-400 text-green-600'
                  : 'border-yellow-400 text-yellow-600'
              }`}
            >
              {health.online ? '● Live' : '● Mock Mode'}
            </span>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="flex items-center gap-1 text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 text-gray-600"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Grade</th>
                <th className="px-5 py-3">Net Recovery</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    No returns data yet. Submit a product in Camera Inspection to get started.
                  </td>
                </tr>
              ) : (
                returns.map((item) => {
                  const id = item._id || item.id;
                  const name = item.product_name || item.name;
                  const grade =
                    item.ai_grading?.condition_grade ||
                    item.condition_grade ||
                    '—';
                  const recovery =
                    item.routing?.calculated_net_recovery ||
                    item.resale_price ||
                    0;
                  const route =
                    item.routing?.optimal_destination ===
                    'MARKETPLACE_RELIST_IN_PLACE'
                      ? '✅ Relist'
                      : '♻️ Recycle';

                  return (
                    <tr key={id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">
                        {String(id).slice(0, 20)}…
                      </td>
                      <td className="px-5 py-3 font-medium text-amazon-navy-dark">
                        {name}
                      </td>
                      <td className="px-5 py-3">
                        <span className="prism-badge bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2 py-0.5 rounded-full">
                          {grade.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold text-green-700">
                        {formatINR(recovery)}
                      </td>
                      <td className="px-5 py-3 text-xs">{route}</td>
                      <td className="px-5 py-3">
                        <span className="text-green-600 font-medium text-xs">
                          {item.status || 'Processed'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Margin alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-amber-800">Margin Protection Active</p>
          <p className="text-sm text-amber-700 mt-1">
            Manual returns processing costs ~₹200 in labor (30–40 min × seller time). Prism
            automated grading saves Meena&apos;s ₹400 margin on the boAt Airdopes 141 return.
          </p>
        </div>
      </div>
    </div>
  );
}