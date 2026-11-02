import { colorOf, levelText, useCountUp } from '../util.js';

export function Num({ value, className = '' }) {
  const v = useCountUp(value);
  return <span className={className}>{v}</span>;
}

export function Badge({ score }) {
  const c = colorOf(score);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold" style={{ color: c, borderColor: c + '66', background: c + '1a' }}>
      <span className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
      {levelText(score)}
    </span>
  );
}

export function Tip({ text, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-[900] hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy-800 px-2.5 py-1 text-xs text-slate-200 shadow-lg ring-1 ring-white/10 group-hover:block">{text}</span>
    </span>
  );
}
