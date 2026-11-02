import { useEffect, useState } from 'react';
import { api } from './api.js';
import Planner from './components/Planner.jsx';
import Analytics from './components/Analytics.jsx';
import About from './components/About.jsx';
import WhyModal from './components/WhyModal.jsx';

const TABS = [['dashboard', 'Dashboard'], ['routes', 'Safe Routes'], ['map', 'Safety Map'], ['analytics', 'Analytics'], ['about', 'About']];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [zones, setZones] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [pts, setPts] = useState({});
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('heat');
  const [hour, setHour] = useState(20);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('idle');
  const [why, setWhy] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.zones(), api.facilities()]).then(([z, f]) => { setZones(z); setFacilities(f); })
      .catch(() => setError('Cannot reach the API on port 5000. Run "npm run dev" from the project root.'));
  }, []);

  const analyze = async (f = from, t = to) => {
    setStatus('loading'); setSelected(null); setRoutes([]);
    try {
      const [res] = await Promise.all([api.analyze({ from: f || 'Current Location', to: t || 'Destination', hour }), new Promise((r) => setTimeout(r, 1600))]);
      setRoutes(res.routes); setPts({ from: res.from, to: res.to }); setStatus('done'); setMode('route');
    } catch { setStatus('idle'); setError('Route analysis failed. Is the API running?'); }
  };
  const demo = () => { setFrom('Location A'); setTo('Location B'); setHour(20); setTab('dashboard'); analyze('Location A', 'Location B'); };
  const go = (k) => { setTab(k); if (k === 'map') setMode('heat'); if (k === 'routes') setMode('route'); };

  const planner = ['dashboard', 'routes', 'map'].includes(tab);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-white/10 bg-navy-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-navy-950">♥</span>
            HER-SAFE <span className="text-cyan-300">AI</span>
          </div>
          <nav className="flex flex-wrap gap-1">
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => go(k)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === k ? 'bg-white/10 text-cyan-200' : 'text-slate-300 hover:bg-white/5'}`}>{l}</button>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Current location (simulated)</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-500/30 ring-1 ring-violet-300/40">👤</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {error && <p className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {planner && (
          <Planner {...{ hour, setHour, mode, setMode, zones, facilities, routes, selected, setSelected, status, from, to, setFrom, setTo, fromPt: pts.from, toPt: pts.to }}
            onAnalyze={() => analyze()} onDemo={demo} onWhy={(id) => setWhy(id)} />
        )}
        {tab === 'analytics' && <Analytics />}
        {tab === 'about' && <About />}
      </main>
      <footer className="pb-6 text-center text-xs text-slate-500">Prototype · simulated data · Estimated risk is informational, not a guarantee.</footer>
      <WhyModal route={routes.find((r) => r.id === why)} hour={hour} onClose={() => setWhy(null)} />
    </div>
  );
}
