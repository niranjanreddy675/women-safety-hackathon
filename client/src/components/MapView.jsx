import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { colorOf, levelText, km, HOURS } from '../util.js';

const EMOJI = { police: '🚓', hospital: '🏥', transit: '🚇', security: '🛡️', lighting: '💡' };
const TYPE_NAME = { police: 'Police station', hospital: 'Hospital', transit: 'Public transport', security: 'Security facility', lighting: 'Street-light infrastructure' };
const facIcon = (t) => L.divIcon({ className: '', html: `<div class="fac fac-${t}">${EMOJI[t]}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] });
const pinIcon = (t) => L.divIcon({ className: '', html: `<div class="pin">${t}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] });
const isGood = (b) => (b.key === 'hist' || b.key === 'time' ? b.rating === 'Low' : b.key === 'activity' ? b.rating === 'High' : b.rating === 'Good');

function Fit({ routes }) {
  const map = useMap();
  useEffect(() => {
    if (routes.length) map.fitBounds(routes.flatMap((r) => r.path), { padding: [50, 50], animate: true });
  }, [routes, map]);
  return null;
}

export default function MapView({ mode, zones, facilities, routes, selected, hour, from, to }) {
  const origin = from ? [from.lat, from.lng] : [13.01, 80.22];
  return (
    <MapContainer center={[13.023, 80.245]} zoom={13} className="h-full w-full">
      <TileLayer
        attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
        url={`https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAP_KEY}`}
      />
      <Fit routes={routes} />

      {mode === 'heat' && zones.map((z) => {
        const s = z.scores[hour], c = colorOf(s);
        return (
          <Circle key={z.id} center={[z.lat, z.lng]} radius={z.radius} pathOptions={{ color: c, fillColor: c, fillOpacity: 0.32, weight: 2 }}>
            <Popup>
              <div className="font-display text-sm font-semibold">ZONE {z.id} <span className="font-normal text-slate-400">· {z.name}</span></div>
              <div className="mt-1 text-slate-400">Estimated Risk:</div>
              <div className="text-lg font-bold" style={{ color: c }}>{s} / 100 <span className="text-xs font-medium">({levelText(s)})</span></div>
              <div className="mt-1 text-slate-400">Contributing factors:</div>
              {z.breakdowns[hour].map((b) => (
                <div key={b.key}>{isGood(b) ? '✓' : '•'} {b.label}: {b.rating}</div>
              ))}
              <div className="mt-1 text-slate-400">Risk by time: {HOURS.map((h) => `${h.short} ${z.scores[h.v]}`).join(' → ')}</div>
              <div className="mt-1">Data confidence: <b>{z.confidence}</b></div>
            </Popup>
          </Circle>
        );
      })}

      {routes.map((r) => {
        const s = r.scores[hour], on = selected === r.id, any = selected != null;
        return (
          <Polyline key={r.id} positions={r.path} pathOptions={{ color: colorOf(s), weight: on ? 8 : any ? 4 : 6, opacity: any && !on ? 0.22 : 0.95, dashArray: any && !on ? '6 10' : null }}>
            <Popup>{r.name}: {r.minutes} min · {r.km} km · Estimated risk {s}/100 ({levelText(s)})</Popup>
          </Polyline>
        );
      })}

      {from && <Marker position={[from.lat, from.lng]} icon={pinIcon('A')}><Popup>{from.label || from.name}</Popup></Marker>}
      {to && <Marker position={[to.lat, to.lng]} icon={pinIcon('B')}><Popup>{to.label || to.name}</Popup></Marker>}

      {facilities.map((f) => (
        <Marker key={f.name} position={[f.lat, f.lng]} icon={facIcon(f.type)}>
          <Popup>
            <div className="font-display text-sm font-semibold">{f.name}</div>
            <div className="text-slate-400">{TYPE_NAME[f.type]}</div>
            <div>Distance from start: <b>{km(origin, [f.lat, f.lng]).toFixed(1)} km</b></div>
            <div className="mt-1 text-slate-400">Available services:</div>
            {f.services.map((s) => <div key={s}>• {s}</div>)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
