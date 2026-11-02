import { Badge } from './Ui.jsx';
import { colorOf, HOURS } from '../util.js';

export default function WhyModal({ route, hour, onClose }) {
  if (!route) return null;
  const score = route.scores[hour];
  const rows = route.breakdowns[hour];
  const t = HOURS.find((h) => h.v === hour)?.l;
  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass w-full max-w-lg bg-navy-900/90 p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{route.name} — Estimated Risk <span style={{ color: colorOf(score) }}>{score}/100</span></h3>
            <p className="mt-1 text-xs text-slate-400">Travel time: {t}</p>
          </div>
          <button className="btn-ghost !px-3 !py-1" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="mt-2"><Badge score={score} /></div>
        <p className="mt-4 mb-2 text-sm font-semibold text-slate-300">Contributing factors</p>
        <div className="space-y-3">
          {rows.map((b) => (
            <div key={b.key}>
              <div className="flex justify-between text-sm">
                <span>{b.label} <span className="text-slate-500">({Math.round(b.weight * 100)}% weight)</span></span>
                <span className="font-semibold text-cyan-200">{b.rating} · +{b.points}</span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 transition-all duration-700" style={{ width: `${Math.min(100, (b.points / (b.weight * 100)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">{route.notes}</p>
        <p className="mt-3 rounded-lg bg-white/5 p-3 text-xs text-slate-400">Risk scores are estimates generated from contextual factors and available prototype data. This is not a validated real-world safety prediction model.</p>
      </div>
    </div>
  );
}
