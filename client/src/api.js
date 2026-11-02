const j = (r) => r.json();
export const api = {
  zones: () => fetch('/api/zones').then(j),
  facilities: () => fetch('/api/facilities').then(j),
  analytics: () => fetch('/api/analytics').then(j),
  analyze: (body) => fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(j),
};
