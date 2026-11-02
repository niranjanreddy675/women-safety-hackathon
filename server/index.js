import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { zones, facilities, routeTemplates, START, END } from './data.js';
import { WEIGHTS, HOURS, TIME_BASE, scoreFactors, scoreByHour, levelOf, breakdown } from './riskEngine.js';

const app = express();
app.use(cors());
app.use(express.json());

// ---- Optional MongoDB (analysis log). App runs fine without it. ----
let dbReady = false;
const Analysis = mongoose.model('Analysis', new mongoose.Schema({
  from: String, to: String, hour: Number, scores: Object, createdAt: { type: Date, default: Date.now },
}));
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 })
    .then(() => { dbReady = true; console.log('MongoDB connected'); })
    .catch((e) => console.log('MongoDB unavailable, continuing without it:', e.message));
}

const withScores = (o) => ({ ...o, scores: scoreByHour(o), breakdowns: Object.fromEntries(HOURS.map((h) => [h, breakdown(o, h)])) });

app.get('/api/health', (_, res) => res.json({ ok: true, db: dbReady }));
app.get('/api/config', (_, res) => res.json({ weights: WEIGHTS, timeBase: TIME_BASE, hours: HOURS }));
app.get('/api/zones', (_, res) => res.json(zones.map(withScores)));
app.get('/api/facilities', (_, res) => res.json(facilities));

// Simulated routing: any input resolves to the demo corridor (no geocoder in the prototype).
app.post('/api/analyze', async (req, res) => {
  const { from = 'Current Location', to = 'Destination', hour = 20 } = req.body || {};
  const routes = routeTemplates.map((r) => ({
    id: r.id, name: r.name, minutes: r.minutes, km: r.km, path: r.path, notes: r.notes,
    scores: scoreByHour(r),
    breakdowns: Object.fromEntries(HOURS.map((h) => [h, breakdown(r, h)])),
  }));
  if (dbReady) {
    Analysis.create({ from, to, hour, scores: Object.fromEntries(routes.map((r) => [r.id, r.scores[hour]])) }).catch(() => {});
  }
  res.json({ from: { ...START, label: from }, to: { ...END, label: to }, routes });
});

// Aggregated analytics + admin data
app.get('/api/analytics', (_, res) => {
  const labels = { 18: '6 PM', 20: '8 PM', 22: '10 PM', 0: '12 AM' };
  const byHour = HOURS.map((h) => {
    const s = zones.map((zn) => scoreFactors(zn, h));
    return { hour: h, label: labels[h], avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length) };
  });
  const at = 20;
  const scored = zones.map((zn) => {
    const sc = scoreFactors(zn, at);
    return { ...zn, score: sc, level: levelOf(sc), breakdown: breakdown(zn, at) };
  });
  const avg = Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length);
  const count = (l) => scored.filter((s) => s.level === l).length;
  const factorAvg = Object.keys(WEIGHTS).map((k) => {
    const rows = scored.map((s) => s.breakdown.find((b) => b.key === k));
    return { key: k, label: rows[0].label, points: +(rows.reduce((a, b) => a + b.points, 0) / rows.length).toFixed(1) };
  });
  const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 4).map((s) => ({
    id: s.id, name: s.name, score: s.score,
    mainFactors: [...s.breakdown].sort((a, b) => b.points - a.points).slice(0, 3).map((b) => `${b.label}: ${b.rating}`),
  }));
  const gaps = scored.filter((s) => s.light > 60 || s.emergency > 55).map((s) => ({
    id: s.id, name: s.name, gap: [s.light > 60 && 'Street-lighting coverage', s.emergency > 55 && 'Emergency facility proximity'].filter(Boolean),
  }));
  const trends = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, i) => ({ month: m, index: [52, 49, 47, 50, 44, 42][i] }));
  res.json({
    totalZones: 124, sampleZones: scored.length, avg, low: count('Lower'), moderate: count('Moderate'), high: count('Higher'),
    distribution: [{ name: 'Lower', value: count('Lower') }, { name: 'Moderate', value: count('Moderate') }, { name: 'Higher', value: count('Higher') }],
    byHour, factorAvg, top, gaps, trends,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`HER-SAFE AI API on http://localhost:${port}`));
