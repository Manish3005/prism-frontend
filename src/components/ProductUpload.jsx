import { useState, useRef } from 'react';
import { Upload, X, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitReturn, pollReturnStatus } from '../api/bridgeApi';
import HealthCard from './HealthCard';
import { PRIMARY_PRODUCTS, formatINR } from '../data/mockProducts';

const CONDITION_HINTS = ['New', 'Open_Box', 'Refurbished', 'Damaged'];

export default function ProductUpload({ onComplete, defaultProduct }) {
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    product_name: defaultProduct?.shortName || 'Wireless Earbuds',
    original_value: defaultProduct?.price || 2499,
    seller_zipcode: defaultProduct?.sellerZipcode || '600001',
    condition_hint: 'Open_Box',
    description: '',
    defects: '',
  });
  const [phase, setPhase] = useState('idle'); // idle | submitting | polling | done | error
  const [trackingId, setTrackingId] = useState(null);
  const [healthCard, setHealthCard] = useState(null);
  const [error, setError] = useState(null);
  const [progressMsg, setProgressMsg] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    setError(null);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      setError('Upload at least one product photo for AI grading');
      return;
    }

    setPhase('submitting');
    setError(null);
    setProgressMsg('Validating payload → pushing to Redis queue...');

    try {
      const accepted = await submitReturn(
        {
          ...form,
          original_value: Number(form.original_value),
        },
        photos
      );

      setTrackingId(accepted.tracking_id);
      setPhase('polling');
      setProgressMsg(`202 Accepted · Tracking: ${accepted.tracking_id} · Worker polling Ollama...`);

      const result = await pollReturnStatus(accepted.tracking_id, {
        onProgress: (data) => {
          setProgressMsg(`Status: ${data.status} — AI grading in progress...`);
        },
      });

      setHealthCard(result);
      setPhase('done');
      onComplete?.(result);
    } catch (err) {
      setPhase('error');
      setError(err.message || 'Submission failed. Is the FastAPI gateway running?');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-amazon overflow-hidden">
      <div className="bg-amazon-navy-light text-white px-5 py-3 flex items-center gap-2">
        <Camera size={20} />
        <div>
          <h2 className="font-bold text-base">Inspection Portal</h2>
          <p className="text-xs text-gray-300">Upload photos & metadata → async AI grading pipeline</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Product selector */}
        <div>
          <label className="block text-sm font-bold text-amazon-navy-dark mb-1">
            Reference Product
          </label>
          <select
            value={form.product_name}
            onChange={(e) => {
              const prod = PRIMARY_PRODUCTS.find((p) => p.shortName === e.target.value);
              setForm((f) => ({
                ...f,
                product_name: e.target.value,
                original_value: prod?.price || f.original_value,
                seller_zipcode: prod?.sellerZipcode || f.seller_zipcode,
              }));
            }}
            className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange outline-none"
          >
            {PRIMARY_PRODUCTS.map((p) => (
              <option key={p.id} value={p.shortName}>
                {p.shortName} — {formatINR(p.price)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Original Value (₹)</label>
            <input
              type="number"
              value={form.original_value}
              onChange={(e) => setForm((f) => ({ ...f, original_value: e.target.value }))}
              className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amazon-orange"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Seller ZIP Code</label>
            <input
              type="text"
              value={form.seller_zipcode}
              onChange={(e) => setForm((f) => ({ ...f, seller_zipcode: e.target.value }))}
              className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amazon-orange"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Condition Hint (for Ollama)</label>
          <div className="flex flex-wrap gap-2">
            {CONDITION_HINTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, condition_hint: c }))}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  form.condition_hint === c
                    ? 'bg-amazon-orange text-white border-amazon-orange'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amazon-orange'
                }`}
              >
                {c.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Item Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Customer returned item — box opened, ear tips missing seal..."
            className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amazon-orange resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Known Defects (comma-separated)</label>
          <input
            type="text"
            value={form.defects}
            onChange={(e) => setForm((f) => ({ ...f, defects: e.target.value }))}
            placeholder="Retail box seal broken, Ear tips unsealed"
            className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amazon-orange"
          />
        </div>

        {/* Photo upload zone */}
        <div>
          <label className="block text-sm font-bold mb-2">Product Photos (max 5)</label>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amazon-orange hover:bg-orange-50/30 cursor-pointer transition-colors"
          >
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600">Click to upload inspection photos</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG — used by Ollama vision/text grading</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 border rounded overflow-hidden group">
                  <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded p-3 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {(phase === 'submitting' || phase === 'polling') && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <Loader2 size={18} className="animate-spin" />
            <div>
              <p className="font-semibold">Async pipeline running...</p>
              <p className="text-xs mt-0.5">{progressMsg}</p>
              {trackingId && (
                <p className="text-xs font-mono mt-1">tracking_id: {trackingId}</p>
              )}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded p-3 text-sm">
            <CheckCircle size={18} />
            Product Health Card generated — listed on Prism Renewed marketplace
          </div>
        )}

        <button
          type="submit"
          disabled={phase === 'submitting' || phase === 'polling'}
          className="w-full amazon-btn-primary py-2.5 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {(phase === 'submitting' || phase === 'polling') ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Processing...
            </>
          ) : (
            'Submit Return for AI Grading'
          )}
        </button>
      </form>

      {healthCard && (
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <HealthCard card={healthCard} />
        </div>
      )}
    </div>
  );
}
