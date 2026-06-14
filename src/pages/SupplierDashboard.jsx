import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  TrendingUp,
  Clock,
  IndianRupee,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import ProductUpload from '../components/ProductUpload';
import DeveloperLogs from '../components/DeveloperLogs';
import HealthCard from '../components/HealthCard';
import { fetchSupplierReturns, checkBackendHealth } from '../api/bridgeApi';
import { MARKETPLACE_LISTINGS, formatINR } from '../data/mockProducts';

export default function SupplierDashboard() {
  const [returns, setReturns] = useState(MARKETPLACE_LISTINGS);
  const [health, setHealth] = useState({ online: false });
  const [latestCard, setLatestCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReturns = async () => {
    setLoading(true);
    try {
      const [data, healthData] = await Promise.all([
        fetchSupplierReturns('600001'),
        checkBackendHealth(),
      ]);
      setReturns(data);
      setHealth(healthData);
    } catch {
      setReturns(MARKETPLACE_LISTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleUploadComplete = (card) => {
    setLatestCard(card);
    setReturns((prev) => [card, ...prev.filter((r) => r._id !== card._id)]);
  };

  const totalRecovery = returns.reduce(
    (sum, r) => sum + (r.routing?.calculated_net_recovery || r.resale_price || 0),
    0
  );
  const relistCount = returns.filter(
    (r) => r.routing?.optimal_destination === 'MARKETPLACE_RELIST_IN_PLACE'
  ).length;

  return (
    <div className="bg-amazon-gray-bg min-h-screen">
      {/* Dashboard header */}
      <div className="bg-amazon-navy-light text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-amazon-orange text-xs font-bold uppercase tracking-wider mb-1">
                Prism Supplier Hub
              </p>
              <h1 className="text-2xl font-bold">Meena&apos;s Operations Portal</h1>
              <p className="text-gray-300 text-sm mt-1">
                Track asset performance · Submit returns · Monitor AI pipeline
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  health.online
                    ? 'border-green-400 text-green-400'
                    : 'border-yellow-400 text-yellow-400'
                }`}
              >
                {health.online ? '● Backend Connected' : '● Mock Mode (set VITE_API_BASE_URL)'}
              </span>
              <button
                type="button"
                onClick={loadReturns}
                className="flex items-center gap-1 text-sm border border-white/30 px-3 py-1.5 rounded hover:bg-white/10"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-6">
        {/* KPI cards */}
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
            <div key={label} className="bg-white rounded-sm shadow-amazon p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={color} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Inspection portal */}
        <section id="inspect">
          <ProductUpload onComplete={handleUploadComplete} />
        </section>

        {/* Latest health card */}
        {latestCard && (
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              Latest Product Health Card
            </h2>
            <HealthCard card={latestCard} />
          </section>
        )}

        {/* Returns table */}
        <section className="bg-white rounded-sm shadow-amazon overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-lg">Asset Performance Ledger</h2>
            <Link to="/marketplace" className="amazon-link text-sm">
              View on Prism Renewed →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
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
                {returns.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-orange-50/30">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">
                      {(item._id || item.id)?.slice(0, 20)}...
                    </td>
                    <td className="px-5 py-3 font-medium">{item.product_name || item.name}</td>
                    <td className="px-5 py-3">
                      <span className="prism-badge bg-blue-100 text-blue-800 border border-blue-200">
                        {(item.ai_grading?.condition_grade || item.condition_grade || '—').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-green-700">
                      {formatINR(item.routing?.calculated_net_recovery || item.resale_price || 0)}
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {item.routing?.optimal_destination === 'MARKETPLACE_RELIST_IN_PLACE'
                        ? '✅ Relist'
                        : '♻️ Recycle'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-green-600 font-medium">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Margin alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-amber-800">Margin Protection Active</p>
            <p className="text-sm text-amber-700 mt-1">
              Manual returns processing costs ~₹200 in labor (30–40 min × seller time).
              Prism automated grading saves Meena&apos;s ₹400 margin on the boAt Airdopes 141 return.
            </p>
          </div>
        </div>

        {/* Developer logs for judges */}
        <section id="logs">
          <h2 className="text-lg font-bold mb-3">Real-Time Pipeline Logs</h2>
          <p className="text-sm text-gray-600 mb-3">
            Live microservices event stream — FastAPI → Redis → Worker → Ollama → MongoDB
          </p>
          <DeveloperLogs />
        </section>
      </div>
    </div>
  );
}
