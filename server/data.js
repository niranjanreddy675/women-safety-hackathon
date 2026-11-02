// Mock geographic data (Chennai-style area). Replace with MongoDB collections later.
const z = (id, name, lat, lng, hist, light, activity, emergency, sens, confidence) =>
  ({ id, name, lat, lng, radius: 650, hist, light, activity, emergency, sens, confidence });

export const zones = [
  z('A', 'Guindy Junction', 13.0067, 80.2206, 30, 20, 25, 20, 0.7, 'Medium'),
  z('B', 'Anna University Campus', 13.0110, 80.2350, 22, 18, 30, 25, 0.6, 'High'),
  z('C', 'Kotturpuram Underpass', 13.0250, 80.2400, 55, 50, 55, 45, 1.2, 'Medium'),
  z('D', 'Saidapet Market', 13.0213, 80.2231, 45, 40, 22, 30, 0.9, 'Medium'),
  z('E', 'Adyar Signal', 13.0067, 80.2570, 28, 25, 24, 22, 0.8, 'High'),
  z('F', 'Indira Nagar Lane', 13.0130, 80.2450, 62, 70, 68, 55, 1.1, 'Low'),
  z('G', 'Mylapore Temple Area', 13.0339, 80.2619, 20, 22, 15, 15, 0.7, 'High'),
  z('H', 'Canal Bank Road', 13.0330, 80.2500, 78, 85, 78, 70, 1.25, 'Low'),
  z('I', 'Teynampet Junction', 13.0400, 80.2500, 35, 30, 30, 28, 0.85, 'Medium'),
  z('J', 'Race Course Stretch', 13.0180, 80.2350, 66, 72, 65, 50, 1.1, 'Medium'),
  z('K', 'Besant Nagar Beach Rd', 12.9990, 80.2660, 40, 45, 50, 45, 1.3, 'Medium'),
  z('L', 'Alwarpet Residential', 13.0330, 80.2560, 25, 30, 35, 30, 0.75, 'Medium'),
  z('M', 'Railway Siding Yard', 13.0290, 80.2210, 75, 80, 82, 65, 1.3, 'Low'),
];

const f = (type, name, lat, lng, services) => ({ type, name, lat, lng, services });
export const facilities = [
  f('police', 'Guindy Police Station', 13.0100, 80.2130, ['24x7 desk', 'Women help desk', 'Patrol vehicles']),
  f('police', 'Adyar Police Station', 13.0060, 80.2560, ['24x7 desk', 'Women help desk']),
  f('police', 'Mylapore Police Station', 13.0330, 80.2690, ['24x7 desk', 'Patrol vehicles']),
  f('police', 'Teynampet Police Station', 13.0450, 80.2510, ['24x7 desk', 'Women help desk']),
  f('police', 'Saidapet Police Station', 13.0230, 80.2240, ['24x7 desk', 'Traffic unit']),
  f('hospital', 'Kotturpuram General Hospital', 13.0210, 80.2420, ['Emergency ward', 'Ambulance', 'Trauma care']),
  f('hospital', 'Adyar Medical Centre', 13.0080, 80.2550, ['Emergency ward', 'Ambulance']),
  f('hospital', 'Mylapore City Hospital', 13.0350, 80.2650, ['Emergency ward', 'Pharmacy 24x7']),
  f('hospital', 'Guindy Govt. Hospital', 13.0040, 80.2200, ['Emergency ward', 'Ambulance', 'Trauma care']),
  f('hospital', 'Teynampet Care Clinic', 13.0420, 80.2480, ['Urgent care', 'Ambulance']),
  f('transit', 'Guindy Metro Station', 13.0090, 80.2130, ['Metro', 'CCTV', 'Staffed 5am-11pm']),
  f('transit', 'Adyar Bus Depot', 13.0050, 80.2590, ['Bus terminus', 'Staffed']),
  f('transit', 'Mylapore MRTS', 13.0340, 80.2680, ['Suburban rail', 'CCTV']),
  f('transit', 'Teynampet Metro', 13.0440, 80.2520, ['Metro', 'CCTV']),
  f('security', 'Anna Univ Security Post', 13.0120, 80.2360, ['Campus guard', 'Emergency call box']),
  f('security', 'Alwarpet Community Watch', 13.0335, 80.2570, ['Resident patrol', 'Call box']),
  f('lighting', 'LED Corridor - Sardar Patel Rd', 13.0150, 80.2300, ['LED street lights', 'Auto-dimming']),
  f('lighting', 'LED Corridor - TTK Road', 13.0380, 80.2600, ['LED street lights', 'Monitored']),
];

// Route "segment profiles" (aggregate contextual factors along each route).
export const routeTemplates = [
  { id: 'A', name: 'Route A', minutes: 14, km: 4.0, hist: 84, light: 80, activity: 65, emergency: 55, sens: 1.0,
    path: [[13.0100,80.2200],[13.0180,80.2350],[13.0250,80.2450],[13.0330,80.2600],[13.0400,80.2700]],
    notes: 'Fastest arterial, passes poorly lit stretches near the canal.' },
  { id: 'B', name: 'Route B', minutes: 18, km: 4.6, hist: 35, light: 30, activity: 25, emergency: 30, sens: 0.8,
    path: [[13.0100,80.2200],[13.0230,80.2260],[13.0370,80.2350],[13.0450,80.2520],[13.0400,80.2700]],
    notes: 'Longer, but stays on active, well-lit roads close to police and metro.' },
  { id: 'C', name: 'Route C', minutes: 12, km: 3.7, hist: 63, light: 58, activity: 50, emergency: 50, sens: 1.0,
    path: [[13.0100,80.2200],[13.0090,80.2400],[13.0200,80.2530],[13.0320,80.2640],[13.0400,80.2700]],
    notes: 'Shortest, mixed lighting and moderate activity.' },
];
export const START = { name: 'Location A', lat: 13.0100, lng: 80.2200 };
export const END = { name: 'Location B', lat: 13.0400, lng: 80.2700 };
