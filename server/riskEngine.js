// Transparent weighted risk model (PROTOTYPE - not a validated safety model).
// To swap in ML later: replace scoreFactors() with a call to a FastAPI service.
export const WEIGHTS = { hist: 0.30, light: 0.20, activity: 0.20, time: 0.15, emergency: 0.15 };

export const LABELS = {
  hist: 'Historical incident factor',
  light: 'Lighting',
  activity: 'Activity level',
  time: 'Time factor',
  emergency: 'Emergency accessibility',
};

// Baseline time-of-day factor (0-100). Zones/routes scale it with `sens`.
export const TIME_BASE = { 18: 25, 20: 40, 22: 65, 0: 80 };
export const HOURS = [18, 20, 22, 0];

const clamp = (n) => Math.max(0, Math.min(100, n));

// f: { hist, light, activity, emergency, sens } -> each 0-100, higher = more contextual risk
export function timeFactor(f, hour) {
  return clamp(TIME_BASE[hour] * (f.sens ?? 1));
}

export function scoreFactors(f, hour) {
  const t = timeFactor(f, hour);
  const raw =
    WEIGHTS.hist * f.hist + WEIGHTS.light * f.light + WEIGHTS.activity * f.activity +
    WEIGHTS.time * t + WEIGHTS.emergency * f.emergency;
  return Math.round(clamp(raw));
}

export const levelOf = (s) => (s <= 30 ? 'Lower' : s <= 60 ? 'Moderate' : 'Higher');

const words = {
  hist: ['Low', 'Moderate', 'High'],
  light: ['Good', 'Fair', 'Poor'],
  activity: ['High', 'Moderate', 'Low'],
  time: ['Low', 'Moderate', 'High'],
  emergency: ['Good', 'Fair', 'Limited'],
};
const bucket = (v) => (v <= 33 ? 0 : v <= 66 ? 1 : 2);

export function breakdown(f, hour) {
  const vals = { hist: f.hist, light: f.light, activity: f.activity, time: timeFactor(f, hour), emergency: f.emergency };
  return Object.keys(WEIGHTS).map((k) => ({
    key: k, label: LABELS[k], weight: WEIGHTS[k], value: Math.round(vals[k]),
    points: +(WEIGHTS[k] * vals[k]).toFixed(1), rating: words[k][bucket(vals[k])],
  }));
}

export function scoreByHour(f) {
  return Object.fromEntries(HOURS.map((h) => [h, scoreFactors(f, h)]));
}
