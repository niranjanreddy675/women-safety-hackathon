import { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { api } from '../api.js';
import { COLORS, colorOf } from '../util.js';

const Kpi = ({ label, value, sub, color = '#22d3ee' }) => (
  <div className="glass p-4">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 font-display text-3xl font-semibold" style={{ color }}>{value}</p>
    {sub && <p className="text-xs text-slate-500">{sub}</p>}
  </div>
);
const Card = ({ title, children }) => (
  <div className="glass p-4"><p className="mb-3 text-sm font-semibold">{title}</p><div className="h-56">{children}</div></div>
);
const axis = { stroke: '#64748b', fontSize: 11 };
const tip = { contentStyle: { background: '#101a40', border: '1px solid #ffffff22', borderRadius: 12, color: '#e2e8f0' } };

export default function Analytics() {
  const [d, setD] = useState(null);
  useEffect(() => { api.analytics().then(setD).catch(() => setD(false)); }, []);
  if (d === false) return <p className="glass p-6">Could not reach the API. Start the server (npm run dev).</p>;
  if (!d) return <p className="glass p-6 text-slate-400">Loading analytics...</p>;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-slate-400">Prototype data at 8:00 PM. Values are simulated estimates, not actual crime levels.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi label="Zones analyzed" value={d.totalZones} sub={`${d.sampleZones} in demo dataset`} />
        <Kpi label="Average estimated risk" value={`${d.avg} / 100`} color={colorOf(d.avg)} />
        <Kpi label="Lower-risk zones" value={d.low} color={COLORS.Lower} />
        <Kpi label="Moderate-risk zones" value={d.moderate} color={COLORS.Moderate} />
        <Kpi label="Higher estimated risk zones" value={d.high} color={COLORS.Higher} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Risk distribution">
          <ResponsiveContainer><PieChart><Pie data={d.distribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
            {d.distribution.map((x) => <Cell key={x.name} fill={COLORS[x.name]} stroke="none" />)}
          </Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer>
        </Card>
        <Card title="Average estimated risk by time of day">
          <ResponsiveContainer><BarChart data={d.byHour}><CartesianGrid stroke="#ffffff12" /><XAxis dataKey="label" {...axis} /><YAxis domain={[0, 100]} {...axis} /><Tooltip {...tip} />
            <Bar dataKey="avg" radius={[8, 8, 0, 0]}>{d.byHour.map((x) => <Cell key={x.hour} fill={colorOf(x.avg)} />)}</Bar></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Risk factor contribution (avg points)">
          <ResponsiveContainer><BarChart data={d.factorAvg} layout="vertical" margin={{ left: 30 }}><CartesianGrid stroke="#ffffff12" /><XAxis type="number" {...axis} /><YAxis type="category" dataKey="label" width={120} {...axis} /><Tooltip {...tip} />
            <Bar dataKey="points" fill="#a78bfa" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer>
        </Card>
      </div>

      <h2 className="pt-2 text-xl font-semibold">Admin · Safety analytics</h2>
      <p className="-mt-3 text-xs text-slate-500">Informational only. Scores summarize contextual factors in the prototype model and make no claims about actual crime levels.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-4">
          <p className="mb-3 text-sm font-semibold">Safety zones with highest estimated risk</p>
          {d.top.map((z) => (
            <div key={z.id} className="mb-3 rounded-xl bg-white/5 p-3">
              <p className="text-sm font-semibold">Zone {z.id} · {z.name}</p>
              <p className="text-sm" style={{ color: colorOf(z.score) }}>Estimated Risk: {z.score}</p>
              <p className="mt-1 text-xs text-slate-400">Main factors: {z.mainFactors.join(' · ')}</p>
            </div>
          ))}
        </div>
        <Card title="Incident trend index (simulated)">
          <ResponsiveContainer><LineChart data={d.trends}><CartesianGrid stroke="#ffffff12" /><XAxis dataKey="month" {...axis} /><YAxis domain={[30, 60]} {...axis} /><Tooltip {...tip} /><Line dataKey="index" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
        </Card>
        <div className="glass p-4">
          <p className="mb-3 text-sm font-semibold">Infrastructure gaps</p>
          {d.gaps.map((g) => (
            <p key={g.id} className="mb-2 text-sm"><b>Zone {g.id}</b> <span className="text-slate-400">{g.name}</span><br /><span className="text-xs text-amber-300">{g.gap.join(', ')}</span></p>
          ))}
        </div>
      </div>
    </div>
  );
}
