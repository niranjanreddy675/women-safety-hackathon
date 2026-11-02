const Block = ({ t, children }) => (<div className="glass p-6"><h3 className="mb-2 text-lg font-semibold text-cyan-200">{t}</h3><div className="text-sm leading-relaxed text-slate-300">{children}</div></div>);

export default function About() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">HER-SAFE AI</h1>
        <p className="mt-1 text-slate-400">Intelligent Safety-Aware Navigation & Risk-Zone Prediction System</p>
      </div>
      <Block t="Problem">Traditional navigation focuses primarily on time and distance and may not provide contextual safety information.</Block>
      <Block t="Solution">HER-SAFE AI combines risk-zone analysis with route comparison to provide users with contextual safety information.</Block>
      <Block t="Innovation">Risk prediction + safety heatmap + route optimization + explainable risk factors, connected in one flow. Users see the trade-off between time, distance and estimated risk, and can always ask "Why this score?".</Block>
      <Block t="How the prototype scores risk">
        Risk = 0.30 × Historical incident + 0.20 × Lighting + 0.20 × Activity + 0.15 × Time of day + 0.15 × Emergency accessibility, normalized to 0–100. Weights live in <code className="text-cyan-200">server/riskEngine.js</code>. This is a transparent prototype model, not a validated real-world safety prediction model, and it uses simulated data.
      </Block>
      <Block t="Architecture">React + Tailwind + Leaflet/OpenStreetMap frontend · Node/Express API · MongoDB (optional analysis log) · the risk engine is a single module that can be replaced by a Python FastAPI ML service.</Block>
      <p className="text-center font-display text-lg text-violet-200">"Navigation should not only tell us where to go — it should help us understand the safety context of the journey."</p>
    </div>
  );
}
