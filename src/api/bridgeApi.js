/**
 * Bridge API client — connects Prism frontend to the FastAPI microservices gateway.
 *
 * Expected backend endpoints (your friend implements these):
 *   POST   /returns/submit          → 202 { tracking_id, status: "QUEUED" }
 *   GET    /returns/{tracking_id}   → 200 Product Health Card document
 *   GET    /returns                 → 200 { items: [...] }
 *   GET    /marketplace/listings    → 200 { listings: [...] }
 *   GET    /health                  → 200 { status: "ok" }
 *   GET    /logs/stream             → SSE or polling for DeveloperLogs
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const POLL_INTERVAL = Number(import.meta.env.VITE_STATUS_POLL_INTERVAL) || 2000;
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data.detail
        ? JSON.stringify(data.detail)
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

/** Simulate async pipeline when backend is offline */
function mockSubmitReturn(payload) {
  const trackingId = `return_req_${Date.now()}`;
  const mockResult = {
    _id: trackingId,
    product_name: payload.product_name,
    original_value: payload.original_value,
    seller_zipcode: payload.seller_zipcode,
    status: 'PROCESSED',
    ai_grading: {
      detected_item: payload.product_name,
      condition_grade: payload.condition_hint || 'Open_Box',
      confidence_score: 0.87,
      detected_defects: payload.defects?.split(',').map((d) => d.trim()).filter(Boolean) || [
        'Retail packaging opened',
      ],
      suggested_depreciation_percentage: 25,
    },
    routing: {
      optimal_destination: 'MARKETPLACE_RELIST_IN_PLACE',
      calculated_net_recovery: Math.round(payload.original_value * 0.72),
      operational_directive: 'Light sanitize, verify functionality, list locally in place.',
    },
  };

  sessionStorage.setItem(`prism_job_${trackingId}`, JSON.stringify(mockResult));
  return { tracking_id: trackingId, status: 'QUEUED', message: 'Accepted for processing' };
}

function mockGetReturnStatus(trackingId) {
  const stored = sessionStorage.getItem(`prism_job_${trackingId}`);
  if (stored) return JSON.parse(stored);
  throw new Error('Tracking ID not found');
}

/**
 * Submit a return for async AI grading (202 Accepted pattern).
 * @param {Object} payload
 * @param {File[]} photos
 */
export async function submitReturn(payload, photos = []) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return mockSubmitReturn(payload);
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  photos.forEach((file, i) => formData.append('photos', file, file.name || `photo_${i}.jpg`));

  const response = await fetch(`${API_BASE}/returns/submit`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (response.status !== 202 && !response.ok) {
    throw new Error(data.detail || 'Submission failed');
  }
  return data;
}

/** Poll until job reaches PROCESSED or FAILED */
export async function pollReturnStatus(trackingId, { onProgress, maxAttempts = 60 } = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1500));
    return mockGetReturnStatus(trackingId);
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const data = await request(`/returns/${trackingId}`);
    onProgress?.(data);

    if (data.status === 'PROCESSED' || data.status === 'FAILED') {
      return data;
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }

  throw new Error('Processing timeout — check backend worker and Ollama');
}

/** Fetch all processed returns for supplier dashboard */
export async function fetchSupplierReturns(sellerZipcode) {
  if (USE_MOCK) {
    const { MARKETPLACE_LISTINGS } = await import('../data/mockProducts');
    return MARKETPLACE_LISTINGS.filter(
      (l) => !sellerZipcode || l.seller_zipcode === sellerZipcode
    );
  }

  const query = sellerZipcode ? `?seller_zipcode=${sellerZipcode}` : '';
  const data = await request(`/returns${query}`);
  return data.items || data;
}

/** Fetch verified secondary marketplace listings */
export async function fetchMarketplaceListings() {
  if (USE_MOCK) {
    const { MARKETPLACE_LISTINGS } = await import('../data/mockProducts');
    return MARKETPLACE_LISTINGS;
  }

  const data = await request('/marketplace/listings');
  return data.listings || data;
}

/** Health check for gateway + worker connectivity */
export async function checkBackendHealth() {
  try {
    const data = await request('/health');
    return { online: true, ...data };
  } catch {
    return { online: false, status: 'offline' };
  }
}

/** Fetch recent pipeline logs for judges demo */
export async function fetchDeveloperLogs(limit = 50) {
  if (USE_MOCK) {
    return [
      {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        service: 'api-gateway',
        message: '[202 Accepted] return_req_mock_101 queued to Upstash Redis LPUSH',
      },
      {
        timestamp: new Date(Date.now() - 3000).toISOString(),
        level: 'INFO',
        service: 'worker-daemon',
        message: 'RPOPLPUSH job → routing to Ollama localhost:11434/api/generate format=json',
      },
      {
        timestamp: new Date(Date.now() - 6000).toISOString(),
        level: 'INFO',
        service: 'ollama-grading',
        message: 'condition_grade=Open_Box confidence=0.88 depreciation=28%',
      },
      {
        timestamp: new Date(Date.now() - 9000).toISOString(),
        level: 'INFO',
        service: 'profitability-engine',
        message: 'Net Recovery ₹1799 > 0 → MARKETPLACE_RELIST_IN_PLACE',
      },
      {
        timestamp: new Date(Date.now() - 12000).toISOString(),
        level: 'INFO',
        service: 'mongodb-ledger',
        message: 'Product Health Card persisted → secondary marketplace sync',
      },
    ];
  }

  const data = await request(`/logs?limit=${limit}`);
  return data.logs || data;
}
export async function analyzeReturnItem(payload) {
  const data = await request('/api/v1/returns/analyze', {
    method: 'POST',
    body: payload,
  });

  return data;
}
export { API_BASE, POLL_INTERVAL, USE_MOCK };
