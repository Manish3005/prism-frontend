import { Shield, Cpu, TrendingUp, MapPin, Hash, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../data/mockProducts';

const GRADE_COLORS = {
  New: 'bg-green-100 text-green-800 border-green-300',
  Open_Box: 'bg-blue-100 text-blue-800 border-blue-300',
  Refurbished: 'bg-amber-100 text-amber-800 border-amber-300',
  Damaged: 'bg-red-100 text-red-800 border-red-300',
};

const ROUTE_LABELS = {
  MARKETPLACE_RELIST_IN_PLACE: {
    label: 'Marketplace Relist In-Place',
    color: 'text-green-700',
    icon: TrendingUp,
  },
  LOCAL_RECYCLE_OR_DONATION_GRID: {
    label: 'Local Recycle / Donation Grid',
    color: 'text-orange-700',
    icon: MapPin,
  },
};

export default function HealthCard({ card, compact = false }) {
  if (!card) return null;

  const grade = card.ai_grading?.condition_grade || 'Unknown';
  const gradeStyle = GRADE_COLORS[grade] || 'bg-gray-100 text-gray-800 border-gray-300';
  const routeKey = card.routing?.optimal_destination;
  const routeInfo = ROUTE_LABELS[routeKey] || ROUTE_LABELS.MARKETPLACE_RELIST_IN_PLACE;
  const RouteIcon = routeInfo.icon;
  const cardId = card._id || card.id;

  if (compact) {
    return (
      <div className="border border-dashed border-amazon-orange rounded-lg p-3 bg-orange-50/50 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-amazon-orange" />
          <span className="font-bold text-amazon-navy-dark">Prism Health Card</span>
          <span className={`ml-auto prism-badge border ${gradeStyle}`}>{grade.replace('_', ' ')}</span>
        </div>
        <p className="text-xs text-gray-600 font-mono truncate">{cardId}</p>
        <p className="text-amazon-green font-semibold mt-1">
          Net Recovery: {formatINR(card.routing?.calculated_net_recovery || 0)}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-amazon-navy bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
      {/* Cryptographic-style header pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,153,0,0.3) 10px,
            rgba(255,153,0,0.3) 11px
          )`,
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/20 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-amazon-orange" size={24} />
              <span className="text-xs uppercase tracking-[0.2em] text-amazon-orange font-semibold">
                Prism Product Health Certificate
              </span>
            </div>
            <h3 className="text-xl font-bold">{card.product_name}</h3>
            <p className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-1">
              <Hash size={12} /> {cardId}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full border text-sm font-bold ${gradeStyle}`}>
              {grade.replace('_', ' ')}
            </span>
            <p className="text-xs text-gray-400 mt-2">Status: {card.status}</p>
          </div>
        </div>

        {/* AI Grading block */}
        {card.ai_grading && (
          <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={18} className="text-amazon-orange" />
              <span className="font-semibold text-sm uppercase tracking-wide">Ollama AI Grading</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Detected Item</span>
                <span>{card.ai_grading.detected_item}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Confidence</span>
                <span className="text-amazon-orange font-bold">
                  {(card.ai_grading.confidence_score * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Depreciation</span>
                <span>{card.ai_grading.suggested_depreciation_percentage}%</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Original Value</span>
                <span>{formatINR(card.original_value)}</span>
              </div>
            </div>
            {card.ai_grading.detected_defects?.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-400 text-xs block mb-1">Detected Defects</span>
                <ul className="flex flex-wrap gap-2">
                  {card.ai_grading.detected_defects.map((defect) => (
                    <li
                      key={defect}
                      className="text-xs bg-red-900/40 border border-red-500/30 px-2 py-0.5 rounded"
                    >
                      {defect}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Routing block */}
        {card.routing && (
          <div className="bg-amazon-orange/10 rounded-lg p-4 border border-amazon-orange/30">
            <div className="flex items-center gap-2 mb-3">
              <RouteIcon size={18} className="text-amazon-orange" />
              <span className="font-semibold text-sm uppercase tracking-wide">Profitability Routing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Optimal Destination</span>
                <span className={`font-bold ${routeInfo.color}`}>{routeInfo.label}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Net Recovery</span>
                <span className="text-2xl font-bold text-green-400">
                  {formatINR(card.routing.calculated_net_recovery)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-300 flex items-start gap-2">
              <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
              {card.routing.operational_directive}
            </p>
          </div>
        )}

        {/* Footer hash strip — cryptographic aesthetic */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[10px] font-mono text-gray-500 break-all leading-relaxed">
            SHA256:PRISM:{cardId}:{grade}:{card.ai_grading?.confidence_score}:
            {card.routing?.calculated_net_recovery}:VERIFIED
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            Seller ZIP: {card.seller_zipcode} · Ledger: MongoDB Atlas · Graded by: Ollama llama3
          </p>
        </div>
      </div>
    </div>
  );
}
