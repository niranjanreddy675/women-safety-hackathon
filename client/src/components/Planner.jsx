import MapView from './MapView.jsx';
import { Badge, Num, Tip } from './Ui.jsx';
import { HOURS, colorOf, DISCLAIMER } from '../util.js';

function Tradeoff({ routes, hour }) {
  const rows = [
    ['Travel time', (r) => r.minutes, (v) => `${v} min`],
    ['Distance', (r) => r.km, (v) => `${v} km`],
    ['Est. risk', (r) => r.scores[hour], (v) => `${v}`],
  ];
  return (
    <div className="glass p-4">
      <p className="mb-3 text-sm font-semibold">Trade-off at a glance</p>
      {rows.map(([label, get, fmt]) => {
        const max = Math.max(...routes.map(get));
        return (
          <div key={label} className="mb-2.5">
            <p className="mb-1 text-xs text-slate-400">{label}</p>
            {routes.map((r) => (
              <div key={r.id} className="mb-1 flex items-center gap-2 text-xs">
                <span className="w-4 text-slate-400">{r.id}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(get(r) / max) * 100}%`, background: label === 'Est. risk' ? colorOf(get(r)) : '#22d3ee' }} />
                </div>
                <span className="w-14 text-right">{fmt(get(r))}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Planner(p) {
  const { hour, setHour, mode, setMode, zones, facilities, routes, route, selected, setSelected, status, from, to, setFrom, setTo, onAnalyze, onDemo, onWhy } = p;
  const zoneC = zones.find((z) => z.id === 'C');
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-4">
        <div className="glass p-5">
          <h1 className="text-2xl font-semibold">Where are you going?</h1>
          <p className="mt-1 text-sm text-slate-400">Don't just find a route. Understand the safety context of the journey.</p>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-semibold tracking-wide text-slate-400">From
              <input className="input mt-1 font-normal" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Current Location" />
            </label>
            <label className="block text-xs font-semibold tracking-wide text-slate-400">To
              <input className="input mt-1 font-normal" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Enter destination" />
            </label>
            <label className="block text-xs font-semibold tracking-wide text-slate-400">Time
              <select className="input mt-1 font-normal" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
                {HOURS.map((h) => <option key={h.v} value={h.v}>{h.v === 20 ? `${h.l} (Now)` : h.l}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary flex-1" onClick={onAnalyze} disabled={status === 'loading'}>Analyze safe routes</button>
            <Tip text="Auto-fill Location A → B and run the demo"><button className="btn-ghost" onClick={onDemo}>Demo mode</button></Tip>
          </div>
          {status === 'loading' && (
            <div className="mt-4">
              <p className="text-sm text-cyan-200">Analyzing contextual safety factors...</p>
              <div className="scanbar mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" />
            </div>
          )}
          {status === 'done' && <p className="mt-4 text-sm text-emerald-300">✓ 3 route options generated.</p>}
          <p className="mt-3 text-xs text-slate-500">{DISCLAIMER}</p>
        </div>

        {routes.map((r) => {
          const s = r.scores[hour], on = selected === r.id;
          return (
            <div key={r.id} className={`glass p-4 transition-all duration-300 hover:-translate-y-0.5 ${on ? 'ring-2 ring-cyan-300/70 shadow-[0_0_28px_#22d3ee44]' : selected ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{r.name}</h3>
                <Badge score={s} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2"><p className="text-lg font-bold">{r.minutes}<span className="text-xs font-medium text-slate-400"> min</span></p></div>
                <div className="rounded-xl bg-white/5 p-2"><p className="text-lg font-bold">{r.km}<span className="text-xs font-medium text-slate-400"> km</span></p></div>
                <div className="rounded-xl bg-white/5 p-2"><p className="text-lg font-bold" style={{ color: colorOf(s) }}><Num value={s} /><span className="text-xs font-medium text-slate-400">/100</span></p></div>
              </div>
              <p className="mt-2 text-xs text-slate-400">Estimated Risk: <b style={{ color: colorOf(s) }}>{s}/100</b></p>
              <div className="mt-3 flex gap-2">
                <button className="btn-primary flex-1 !py-2" onClick={() => setSelected(on ? null : r.id)}>{on ? 'Clear selection' : 'View route'}</button>
                <button className="btn-ghost flex-1 !py-2" onClick={() => onWhy(r.id)}>Why this score?</button>
              </div>
            </div>
          );
        })}
        {routes.length > 0 && <Tradeoff routes={routes} hour={hour} />}
      </div>

      <div className="space-y-4 lg:col-span-8">
        <div className="glass flex flex-wrap items-center justify-between gap-3 p-3">
          <div className="flex rounded-xl bg-navy-900/80 p-1">
            {[['route', 'Route view'], ['heat', 'Safety heatmap']].map(([k, l]) => (
              <button key={k} onClick={() => setMode(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === k ? 'bg-gradient-to-r from-cyan-300 to-violet-400 text-navy-950' : 'text-slate-300 hover:text-white'}`}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-xs text-slate-400">Travel time</span>
            {HOURS.map((h) => (
              <button key={h.v} onClick={() => setHour(h.v)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${hour === h.v ? 'border-cyan-300 bg-cyan-300/15 text-cyan-200' : 'border-white/10 hover:bg-white/10'}`}>{h.l}</button>
            ))}
          </div>
        </div>

        <div className="glass relative h-[520px] overflow-hidden p-0 lg:h-[600px]">
          <MapView mode={mode} zones={zones} facilities={facilities} routes={routes} selected={selected} hour={hour} from={p.fromPt} to={p.toPt} />
          <div className="absolute bottom-3 left-3 z-[500] rounded-xl bg-navy-900/90 p-3 text-xs ring-1 ring-white/10 backdrop-blur">
            <p className="mb-1.5 font-semibold">Estimated Contextual Risk</p>
            {[['Lower', '#22c55e', '0–30'], ['Moderate', '#facc15', '31–60'], ['Higher', '#ef4444', '61–100']].map(([l, c, r]) => (
              <p key={l} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{r} {l}</p>
            ))}
            <p className="mt-1.5 text-slate-400">🚓 Police 🏥 Hospital 🚇 Transit 🛡️ Security 💡 Lights</p>
          </div>
        </div>

        {zoneC && (
          <div className="glass flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold">Zone C · {zoneC.name}</p>
              <p className="text-xs text-slate-400">Estimated risk varies with contextual conditions and time.</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {HOURS.map((h, i) => (
                <div key={h.v} className="flex items-center gap-2">
                  {i > 0 && <span className="text-slate-600">→</span>}
                  <div className={`rounded-lg px-2.5 py-1.5 text-center transition-all ${hour === h.v ? 'bg-white/10 ring-1 ring-cyan-300/60' : ''}`}>
                    <p className="text-[10px] text-slate-400">{h.short}</p>
                    <p className="font-bold" style={{ color: colorOf(zoneC.scores[h.v]) }}>{zoneC.scores[h.v]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Selected time</p>
              <p className="text-2xl font-bold" style={{ color: colorOf(zoneC.scores[hour]) }}><Num value={zoneC.scores[hour]} /></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
