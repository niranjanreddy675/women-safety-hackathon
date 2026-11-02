import { useEffect, useRef, useState } from 'react';

export const levelOf = (s) => (s <= 30 ? 'Lower' : s <= 60 ? 'Moderate' : 'Higher');
export const levelText = (s) => `${levelOf(s)} estimated risk`;
export const COLORS = { Lower: '#22c55e', Moderate: '#facc15', Higher: '#ef4444' };
export const colorOf = (s) => COLORS[levelOf(s)];
export const HOURS = [
  { v: 18, l: '06:00 PM', short: '6 PM' },
  { v: 20, l: '08:00 PM', short: '8 PM' },
  { v: 22, l: '10:00 PM', short: '10 PM' },
  { v: 0, l: '12:00 AM', short: '12 AM' },
];
export const DISCLAIMER = 'Safety estimates are informational and should not be treated as guarantees.';

export function km(a, b) {
  const R = 6371, r = (d) => (d * Math.PI) / 180;
  const dl = r(b[0] - a[0]), dn = r(b[1] - a[1]);
  const x = Math.sin(dl / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function useCountUp(target, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(), a = from.current;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms);
      const cur = Math.round(a + (target - a) * (1 - Math.pow(1 - p, 3)));
      setV(cur); from.current = cur;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}
