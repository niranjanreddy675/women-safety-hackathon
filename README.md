# HER-SAFE AI — Safety-Aware Navigation & Risk-Zone Prediction (Prototype)

MERN-style prototype: **React (Vite) + Tailwind + Leaflet/OpenStreetMap** frontend, **Node/Express** API, **MongoDB (optional)**.
All data is simulated. Scores are informational estimates, not a validated safety model.

## Run
Requires Node.js 18+.

```bash
npm run install:all     # installs root, server and client dependencies
npm run dev             # starts API (http://localhost:5000) and web app (http://localhost:5173)
```
Open http://localhost:5173 and click **Demo mode**.

### Optional MongoDB
```bash
cp server/.env.example server/.env    # then keep or edit MONGO_URI
```
With a running MongoDB, every route analysis is logged to the `analyses` collection. Without it, the app works normally.

## Demo script (2-3 min)
1. Open the app: the Safety Heatmap shows zones (click one for its factors and data confidence).
2. Click **Demo mode**: Location A -> Location B, loading animation, 3 routes (about 14 min/68, 18 min/31, 12 min/54 at 8 PM).
3. Click **View route** to highlight one route and dim the rest; check the trade-off panel.
4. Click **Why this score?** for the weighted factor breakdown.
5. Switch time (6 PM ... 12 AM) and watch the scores animate; Zone C shows the time trend.
6. Toggle Route view / Safety heatmap; click facility icons for distance and services.
7. Analytics tab: KPIs, charts, admin view.

## Structure
```
server/riskEngine.js   weights (configurable) + scoring + explanations  <- swap for a FastAPI ML service
server/data.js         mock zones, facilities, route profiles
server/index.js        Express API (+ optional Mongo logging)
client/src/App.jsx     state + navigation
client/src/components  Planner, MapView, WhyModal, Analytics, About
```
Risk = 0.30 hist + 0.20 lighting + 0.20 activity + 0.15 time + 0.15 emergency access (0-100). Edit `WEIGHTS` in `server/riskEngine.js`.

## Notes
- No geocoder: any From/To text resolves to the demo corridor (Location A -> B).
- "Now" is simulated as 8:00 PM.
- Map tiles need internet (CARTO dark tiles built on OpenStreetMap data).
