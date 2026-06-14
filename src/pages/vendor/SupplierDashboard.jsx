import { useState, useEffect } from 'react';
import { Camera, Inbox, LayoutGrid, RefreshCw } from 'lucide-react';
import { fetchSupplierReturns, checkBackendHealth } from '../../api/bridgeApi';
import { MARKETPLACE_LISTINGS } from '../../data/mockProducts';
import CameraInspectionTab from '../../components/vendor/CameraInspectionTab';
import ItemsTab from '../../components/vendor/ItemsTab';
import SupplierHubTab from '../../components/vendor/SupplierHubTab';

const TABS = [
  { key: 'camera', label: 'Camera Inspection', icon: Camera },
  { key: 'items',  label: 'Items',             icon: Inbox  },
  { key: 'hub',    label: 'Supplier Hub',       icon: LayoutGrid },
];

export default function SupplierDashboard() {
  const [activeTab, setActiveTab]   = useState('camera');
  const [returns, setReturns]       = useState(MARKETPLACE_LISTINGS);
  const [health, setHealth]         = useState({ online: false });
  const [loading, setLoading]       = useState(false);

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

  useEffect(() => { loadReturns(); }, []);

  /**
   * When the camera finishes scanning an item, prepend it to returns
   * and auto-switch to the Items tab so the user can assign it.
   */
  const handleItemScanned = (card) => {
    setReturns((prev) => [card, ...prev.filter((r) => r._id !== card._id)]);
    setActiveTab('items');
  };

  return (
    <div className="bg-amazon-gray-bg min-h-screen">

      {/* Dashboard header */}
      <div className="bg-amazon-navy-light text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-amazon-orange text-xs font-bold uppercase tracking-wider mb-1">
                Prism Vendor Portal
              </p>
              <h1 className="text-2xl font-bold">Meena&apos;s Operations Hub</h1>
              <p className="text-gray-300 text-sm mt-1">
                Inspect returns · Grade items · Assign destinations
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
                {health.online ? '● Backend Connected' : '● Mock Mode'}
              </span>
              <button
                type="button"
                onClick={loadReturns}
                className="flex items-center gap-1 text-sm border border-white/30 px-3 py-1.5 rounded hover:bg-white/10"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar — lives inside the navy header */}
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? 'border-amazon-orange text-amazon-orange bg-white/5'
                        : 'border-transparent text-gray-300 hover:text-white hover:border-white/40'
                    }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {activeTab === 'camera' && (
          <CameraInspectionTab onItemScanned={handleItemScanned} />
        )}
        {activeTab === 'items' && (
          <ItemsTab items={returns} />
        )}
        {activeTab === 'hub' && (
          <SupplierHubTab
            returns={returns}
            health={health}
            loading={loading}
            onRefresh={loadReturns}
          />
        )}
      </div>
    </div>
  );
}