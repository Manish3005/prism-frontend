import { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, Wifi, WifiOff, Circle } from 'lucide-react';
import { fetchDeveloperLogs, checkBackendHealth, API_BASE } from '../api/bridgeApi';

const LEVEL_COLORS = {
  INFO: 'text-green-400',
  WARN: 'text-yellow-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-gray-400',
};

const SERVICE_COLORS = {
  'api-gateway': 'text-blue-400',
  'worker-daemon': 'text-purple-400',
  'ollama-grading': 'text-amazon-orange',
  'profitability-engine': 'text-green-400',
  'mongodb-ledger': 'text-cyan-400',
};

export default function DeveloperLogs({ autoRefresh = true, refreshInterval = 5000 }) {
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState({ online: false });
  const [loading, setLoading] = useState(true);
  const logEndRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logData, healthData] = await Promise.all([
        fetchDeveloperLogs(),
        checkBackendHealth(),
      ]);
      setLogs(Array.isArray(logData) ? logData : []);
      setHealth(healthData);
    } catch {
      setHealth({ online: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (!autoRefresh) return undefined;
    const interval = setInterval(loadData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const formatTime = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString('en-IN', { hour12: false });
    } catch {
      return ts;
    }
  };

  return (
    <div className="bg-[#0d1117] rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <Circle size={12} className="text-red-500 fill-red-500" />
            <Circle size={12} className="text-yellow-500 fill-yellow-500" />
            <Circle size={12} className="text-green-500 fill-green-500" />
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Terminal size={16} />
            <span className="font-mono">prism-pipeline — microservices event log</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            {health.online ? (
              <>
                <Wifi size={14} className="text-green-400" />
                <span className="text-green-400">Gateway Online</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-red-400" />
                <span className="text-red-400">Gateway Offline (mock logs)</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors"
            title="Refresh logs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Architecture diagram strip */}
      <div className="bg-[#0d1117] px-4 py-2 border-b border-gray-800 text-[10px] font-mono text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
        <span>Client →</span>
        <span className="text-blue-400">FastAPI Gateway</span>
        <span>→</span>
        <span className="text-red-400">Upstash Redis LPUSH</span>
        <span>→</span>
        <span className="text-purple-400">Worker Daemon</span>
        <span>→</span>
        <span className="text-orange-400">Ollama :11434</span>
        <span>→</span>
        <span className="text-green-400">Profitability Engine</span>
        <span>→</span>
        <span className="text-cyan-400">MongoDB Atlas</span>
      </div>

      {/* Log output */}
      <div className="h-64 overflow-y-auto p-4 font-mono text-xs prism-scroll">
        {logs.length === 0 && !loading && (
          <p className="text-gray-500">No logs yet. Submit a return to see the pipeline in action.</p>
        )}
        {logs.map((log, i) => (
          <div key={i} className="mb-1.5 leading-relaxed hover:bg-white/5 px-1 rounded">
            <span className="text-gray-600">[{formatTime(log.timestamp)}]</span>
            {' '}
            <span className={LEVEL_COLORS[log.level] || 'text-gray-400'}>{log.level?.padEnd(5)}</span>
            {' '}
            <span className={SERVICE_COLORS[log.service] || 'text-gray-300'}>
              [{log.service}]
            </span>
            {' '}
            <span className="text-gray-200">{log.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Footer status bar */}
      <div className="bg-[#161b22] px-4 py-1.5 border-t border-gray-700 text-[10px] font-mono text-gray-500 flex justify-between">
        <span>API: {API_BASE}</span>
        <span>Ollama: localhost:11434 · Redis: Upstash · DB: MongoDB Atlas</span>
      </div>
    </div>
  );
}
