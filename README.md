# Prism Frontend — The Intelligent Bridge

Amazon.in-style UI for **HackOnAmazon 2026**. Connects to your friend's FastAPI + Ollama microservices backend.

## Quick Start

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Pages & Hackathon Coverage

| Route | Purpose |
|-------|---------|
| `/` | Amazon-style product catalog (5 mock products) |
| `/product/:id` | Product detail page |
| `/supplier` | **Supplier Dashboard** — Meena's ops portal, KPIs, asset ledger |
| `/supplier#inspect` | **Inspection Portal** — photo upload + async return submission |
| `/supplier#logs` | **Developer Logs** — real-time pipeline event stream for judges |
| `/marketplace` | **Prism Renewed** — secondary resale marketplace with Health Cards |
| `/renewed/:id` | Renewed listing detail + certificate |
| `/checkout-nudge` | **Prevention Alert** — checkout fit nudge mockup |

## Backend Integration

Set in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_STATUS_POLL_INTERVAL=2000
VITE_USE_MOCK_API=false
```

### Expected FastAPI Endpoints

Your backend should implement:

```
POST /returns/submit          → 202 { tracking_id, status: "QUEUED" }
GET  /returns/{tracking_id}   → 200 Product Health Card (when PROCESSED)
GET  /returns?seller_zipcode= → 200 { items: [...] }
GET  /marketplace/listings    → 200 { listings: [...] }
GET  /health                  → 200 { status: "ok" }
GET  /logs?limit=50           → 200 { logs: [...] }
```

### Submit Payload (multipart/form-data)

| Field | Type | Description |
|-------|------|-------------|
| `product_name` | string | e.g. "Wireless Earbuds" |
| `original_value` | number | e.g. 2499 |
| `seller_zipcode` | string | e.g. "600001" |
| `condition_hint` | string | New \| Open_Box \| Refurbished \| Damaged |
| `description` | string | Free-text item description for Ollama |
| `defects` | string | Comma-separated defects |
| `photos` | File[] | Inspection images |

### Health Card Response Schema

See `src/components/HealthCard.jsx` — matches MongoDB document layout from hackathon spec.

## Mock Mode

If backend is offline, set `VITE_USE_MOCK_API=true` — UI works fully with simulated 202 → poll → Health Card flow.

## Deploy to Vercel

```bash
npm run build
```

Set `VITE_API_BASE_URL` to your Render FastAPI URL in Vercel environment variables.

## Architecture (Frontend ↔ Backend)

```
React UI  →  POST /returns/submit  →  FastAPI Gateway (202 Accepted)
                ↓
           Upstash Redis LPUSH
                ↓
           Worker Daemon → Ollama :11434 → Profitability Engine → MongoDB
                ↓
React UI  ←  GET /returns/{id}  ←  Product Health Card
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS (Amazon color palette)
- React Router v6
- Lucide icons
