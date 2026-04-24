import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement, DoughnutController, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from "chart.js";
Chart.register(ArcElement, DoughnutController, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #0a0a0f; --surface: rgba(255,255,255,0.04); --surface2: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08); --border-hover: rgba(255,255,255,0.15);
    --text: #f8f8ff; --text2: rgba(248,248,255,0.4); --text3: rgba(248,248,255,0.2);
    --accent: #6366f1; --accent-hover: #5254cc; --accent-glow: rgba(99,102,241,0.08);
    --accent-border: rgba(99,102,241,0.3); --warning: #f59e0b;
    --warning-bg: rgba(245,158,11,0.08); --warning-border: rgba(245,158,11,0.25);
    --danger: #ef4444; --danger-bg: rgba(239,68,68,0.08); --danger-border: rgba(239,68,68,0.25);
    --success: #22c55e; --success-bg: rgba(34,197,94,0.08); --success-border: rgba(34,197,94,0.2);
  }
  .app { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }
  .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 240px; background: #0d0d15; border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 28px 0; z-index: 100; }
  .logo { padding: 0 24px 28px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
  .logo-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--text); }
  .logo-name span { color: var(--accent); }
  .logo-tag { font-size: 10px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }
  .nav { flex: 1; padding: 0 12px; }
  .nav-section { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); padding: 16px 12px 8px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: all 0.15s; color: var(--text2); font-size: 13.5px; margin-bottom: 2px; border: 1px solid transparent; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent-glow); border-color: var(--accent-border); color: var(--text); font-weight: 500; }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .nav-badge { margin-left: auto; background: var(--danger); color: white; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 10px; }
  .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid var(--border); margin: 0 12px; }
  .user-info { display: flex; align-items: center; gap: 10px; padding: 10px 0; }
  .user-avatar { width: 34px; height: 34px; background: var(--accent-glow); border: 1px solid var(--accent-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--accent); flex-shrink: 0; }
  .user-name { font-size: 13px; color: var(--text); font-weight: 500; }
  .user-role { font-size: 11px; color: var(--text3); }
  .main { margin-left: 240px; min-height: 100vh; padding: 36px 32px; box-sizing: border-box; }
  .inner { max-width: 900px; margin: 0 auto; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; animation: fadeIn 0.5s ease; }
  .page-greeting { font-size: 11px; color: var(--text3); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: var(--text); letter-spacing: -0.5px; }
  .page-title em { font-style: italic; color: var(--accent); }
  .notif-btn { width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; position: relative; transition: border-color 0.2s; }
  .notif-btn:hover { border-color: var(--accent-border); }
  .notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--danger); border-radius: 50%; border: 1.5px solid var(--bg); }
  .alert-banner { background: var(--warning-bg); border: 1px solid var(--warning-border); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; margin-bottom: 28px; font-size: 13.5px; color: rgba(245,158,11,0.9); }
  .alert-banner strong { font-weight: 600; color: var(--warning); }
  .alert-action { margin-left: auto; background: var(--warning); color: #0a0a0f; border: none; border-radius: 8px; padding: 7px 16px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; transition: border-color 0.2s, background 0.2s; }
  .stat-card:hover { border-color: var(--border-hover); background: var(--surface2); }
  .stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; font-weight: 500; }
  .stat-value { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--text); letter-spacing: -1px; line-height: 1; margin-bottom: 8px; }
  .stat-sub { font-size: 12px; color: var(--text2); }
  .tag-ok { color: var(--success); }
  .tag-warn { color: var(--warning); }
  .fat-bar-wrap { background: rgba(255,255,255,0.07); border-radius: 6px; height: 5px; margin: 10px 0 8px; overflow: hidden; }
  .fat-bar { height: 100%; border-radius: 6px; }
  .charts-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-center-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; }
  .chart-center-value { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--text); line-height: 1; }
  .chart-center-sub { font-size: 10px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 3px; }
  .pie-legend { display: flex; gap: 20px; margin-top: 14px; justify-content: center; }
  .pie-legend-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text2); }
  .pie-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; transition: border-color 0.2s; }
  .card:hover { border-color: var(--border-hover); }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .card-title { font-size: 14px; font-weight: 500; color: var(--text); }
  .card-link { font-size: 12px; color: var(--accent); cursor: pointer; font-weight: 500; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .card-link:hover { opacity: 0.7; }
  .alert-list { display: flex; flex-direction: column; gap: 8px; }
  .alert-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px; border-radius: 10px; font-size: 13px; }
  .alert-item.warn { background: var(--warning-bg); border: 1px solid var(--warning-border); color: rgba(245,158,11,0.85); }
  .alert-item.ok { background: var(--success-bg); border: 1px solid var(--success-border); color: rgba(34,197,94,0.85); }
  .alert-item-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .alert-item-title { font-weight: 500; font-size: 12.5px; }
  .alert-item-sub { font-size: 11.5px; opacity: 0.7; margin-top: 2px; }
  .chat-list { display: flex; flex-direction: column; gap: 4px; }
  .chat-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px; cursor: pointer; transition: background 0.15s; }
  .chat-item:hover { background: var(--surface2); }
  .chat-avatar { width: 36px; height: 36px; background: var(--accent-glow); border: 1px solid var(--accent-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--accent); flex-shrink: 0; }
  .chat-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .chat-preview { font-size: 12px; color: var(--text2); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
  .chat-time { font-size: 11px; color: var(--text3); margin-left: auto; flex-shrink: 0; }
  .chat-unread { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; flex-shrink: 0; }
  .ia-box { background: var(--accent-glow); border: 1px solid var(--accent-border); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; }
  .ia-tag { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .ia-msg { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .ia-input-wrap { display: flex; gap: 8px; }
  .ia-input { flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.15s; }
  .ia-input::placeholder { color: var(--text3); }
  .ia-input:focus { border-color: var(--accent-border); background: var(--accent-glow); }
  .ia-send { padding: 10px 16px; background: var(--accent); color: white; border: none; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .ia-send:hover { background: var(--accent-hover); }
  @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .bottom-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 768px) { .sidebar { display: none; } .main { margin-left: 0; padding: 24px 16px; } .stats-grid { grid-template-columns: 1fr 1fr; } .bottom-grid { grid-template-columns: 1fr; } }
`;

const pct = 84;
const pieData = [
  { label: "Serviços", value: 58, color: "#6366f1" },
  { label: "Produtos", value: 27, color: "#22c55e" },
  { label: "Outros", value: 15, color: "#f59e0b" },
];
const waveMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
const waveValues = [4200, 5100, 6300, 7200, 8100, 8900, 9200, 9800];

function PieChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: pieData.map((d) => d.label),
        datasets: [{ data: pieData.map((d) => d.value), backgroundColor: pieData.map((d) => d.color + "cc"), borderColor: pieData.map((d) => d.color), borderWidth: 2, hoverOffset: 6 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "72%",
        animation: { duration: 300, easing: "easeInOutSine" },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(15,15,25,0.95)", titleColor: "#f8f8ff", bodyColor: "rgba(248,248,255,0.6)", borderColor: "rgba(99,102,241,0.3)", borderWidth: 1, padding: 10, callbacks: { label: (ctx) => ` ${ctx.parsed.toFixed(1)}%` } } },
      },
    });
    const interval = setInterval(() => {
      const base = [58, 27, 15];
      const noise = base.map(v => v + (Math.random() - 0.5) * 4);
      const total = noise.reduce((a, b) => a + b, 0);
      const norm = noise.map(v => parseFloat(((v / total) * 100).toFixed(1)));
      if (chartRef.current) { chartRef.current.data.datasets[0].data = norm; chartRef.current.update(); }
    }, 600);
    return () => { clearInterval(interval); chartRef.current?.destroy(); };
  }, []);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="card-title">🍩 Faturamento por Categoria</span>
        <span style={{ fontSize: 11, color: "var(--text3)" }}>2024</span>
      </div>
      <div style={{ position: "relative", height: 160, width: 160 }}>
        <canvas ref={canvasRef} />
        <div className="chart-center-label">
          <div className="chart-center-value">84%</div>
          <div className="chart-center-sub">do limite</div>
        </div>
      </div>
      <div className="pie-legend">
        {pieData.map((d) => (
          <div key={d.label} className="pie-legend-row">
            <span className="pie-legend-dot" style={{ background: d.color }} />
            {d.label} <strong style={{ color: "var(--text)", marginLeft: 4 }}>{d.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function WaveChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const valuesRef = useRef([...waveValues]);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: waveMonths,
        datasets: [{ label: "Faturamento", data: [...waveValues], borderColor: "#6366f1", borderWidth: 2.5, pointBackgroundColor: "#6366f1", pointBorderColor: "#0a0a0f", pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6, tension: 0.45, fill: true,
          backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, "rgba(99,102,241,0.28)"); g.addColorStop(1, "rgba(99,102,241,0.01)"); return g; } }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { intersect: false, mode: "index" },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(15,15,25,0.95)", titleColor: "#f8f8ff", bodyColor: "rgba(248,248,255,0.6)", borderColor: "rgba(99,102,241,0.3)", borderWidth: 1, padding: 10, callbacks: { label: (ctx) => ` R$ ${(ctx.parsed.y / 1000).toFixed(1)}k` } } },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(248,248,255,0.3)", font: { size: 11 }, maxRotation: 0 } },
          y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "rgba(248,248,255,0.3)", font: { size: 11 }, callback: (v) => "R$" + (v / 1000).toFixed(0) + "k" }, min: 2000, max: 12000 },
        },
      },
    });
    const interval = setInterval(() => {
      valuesRef.current = waveValues.map((base) => Math.round(base + (Math.random() - 0.5) * base * 0.16));
      if (chartRef.current) { chartRef.current.data.datasets[0].data = [...valuesRef.current]; chartRef.current.update("none"); }
    }, 500);
    return () => { clearInterval(interval); chartRef.current?.destroy(); };
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">📈 Evolução Mensal</div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Faturamento 2024</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--accent)" }}>R$68,4k</div>
          <div style={{ fontSize: 11, color: "var(--success)", marginTop: 2 }}>+12,3% vs 2023</div>
        </div>
      </div>
      <div style={{ position: "relative", height: 140 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default function Home({ onNavegar }) {
  const [iaInput, setIaInput] = useState("");
  const [iaResp, setIaResp] = useState("Olá! Sou o assistente do BridgeMEI. Pergunte sobre DAS, DASN-SIMEI, notas fiscais e muito mais.");
  const [activeNav, setActiveNav] = useState("home");

  const navegar = (id) => { setActiveNav(id); if (id !== "home") onNavegar(id); };

  const handleIa = () => {
    if (!iaInput.trim()) return;
    const q = iaInput.toLowerCase();
    let resp = "Não tenho essa informação ainda. Vou encaminhar sua dúvida ao seu contador!";
    if (q.includes("das")) resp = "O DAS vence todo dia 20 do mês seguinte.";
    else if (q.includes("dasn") || q.includes("declara")) resp = "A DASN-SIMEI é a declaração anual do MEI. Prazo: 31 de maio.";
    else if (q.includes("nota") || q.includes("nf")) resp = "O MEI pode emitir NFS-e pelo sistema da prefeitura.";
    else if (q.includes("limite") || q.includes("faturamento")) resp = `Seu faturamento está em ${pct}% do limite de R$ 81.000.`;
    setIaResp(resp);
    setIaInput("");
  };

  const navItems = [
    { id: "home", icon: "⊞", label: "Início" },
    { id: "chat", icon: "💬", label: "Mensagens", badge: 2 },
    { id: "docs", icon: "📁", label: "Documentos" },
    { id: "alerts", icon: "🔔", label: "Alertas", badge: 1 },
    { id: "dashboard", icon: "📊", label: "Faturamento" },
    { id: "edu", icon: "📚", label: "Aprendizado" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-name">Bridge<span>MEI</span></div>
            <div className="logo-tag">Gestão simplificada</div>
          </div>
          <nav className="nav">
            <div className="nav-section">Menu</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`} onClick={() => navegar(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">T</div>
              <div><div className="user-name">Tassi</div><div className="user-role">MEI · Autônoma</div></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="inner">
            <div className="topbar">
              <div>
                <div className="page-greeting">Bem-vinda de volta</div>
                <h1 className="page-title">Olá, <em>Tassi</em> 👋</h1>
              </div>
              <button className="notif-btn">🔔<span className="notif-dot" /></button>
            </div>

            <div className="alert-banner">
              <span>⚠️</span>
              <div><strong>DAS de maio vence em 6 dias</strong> — R$ 72,60 · Mantenha seu CNPJ em dia.</div>
              <button className="alert-action" onClick={() => navegar("alerts")}>Ver alertas</button>
            </div>

            <div className="stats-grid">
              <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navegar("dashboard")}>
                <div className="stat-label">Faturamento 2024</div>
                <div className="stat-value">R$ 68,4k</div>
                <div className="fat-bar-wrap"><div className="fat-bar" style={{ width: `${pct}%`, background: "#f59e0b" }} /></div>
                <div className="stat-sub"><span className="tag-warn">{pct}% do limite</span> · R$ 12,6k restantes</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Status CNPJ</div>
                <div className="stat-value" style={{ fontSize: 20, paddingTop: 6 }}>Ativo ✓</div>
                <div className="stat-sub" style={{ marginTop: 8 }}><span className="tag-ok">Sem pendências</span></div>
              </div>
              <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navegar("alerts")}>
                <div className="stat-label">Próximo prazo</div>
                <div className="stat-value" style={{ fontSize: 20, paddingTop: 6 }}>DAS Mai</div>
                <div className="stat-sub" style={{ marginTop: 8 }}>Vence <span className="tag-warn">20/05/2025</span> · R$ 72,60</div>
              </div>
              <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => navegar("docs")}>
                <div className="stat-label">Documentos</div>
                <div className="stat-value">7</div>
                <div className="stat-sub"><span className="tag-warn">2 aguardando</span> revisão</div>
              </div>
            </div>

            <div className="charts-grid">
              <PieChart />
              <WaveChart />
            </div>

            <div className="bottom-grid">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">🔔 Alertas</span>
                  <button className="card-link" onClick={() => navegar("alerts")}>Ver todos</button>
                </div>
                <div className="alert-list">
                  <div className="alert-item warn"><span className="alert-item-icon">📅</span><div><div className="alert-item-title">DAS vence em 6 dias</div><div className="alert-item-sub">Ref. maio/2025 · R$ 72,60</div></div></div>
                  <div className="alert-item warn"><span className="alert-item-icon">📊</span><div><div className="alert-item-title">84% do limite atingido</div><div className="alert-item-sub">Restam R$ 12.600 no ano</div></div></div>
                  <div className="alert-item ok"><span className="alert-item-icon">✅</span><div><div className="alert-item-title">DASN-SIMEI entregue</div><div className="alert-item-sub">Declaração 2023 · Aprovada</div></div></div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">💬 Mensagens</span>
                  <button className="card-link" onClick={() => navegar("chat")}>Abrir chat</button>
                </div>
                <div className="chat-list">
                  {[
                    { init: "C", name: "Contador Silva", preview: "Enviei o boleto do DAS...", time: "10:42", unread: true },
                    { init: "🤖", name: "Assistente IA", preview: "Posso te ajudar com dúvidas", time: "09:15", unread: true },
                    { init: "C", name: "Contador Silva", preview: "Documentos recebidos!", time: "Seg", unread: false },
                  ].map((c, i) => (
                    <div key={i} className="chat-item" onClick={() => navegar("chat")}>
                      <div className="chat-avatar">{c.init}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="chat-name">{c.name}</div>
                        <div className="chat-preview">{c.preview}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                        <span className="chat-time">{c.time}</span>
                        {c.unread && <span className="chat-unread" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><span className="card-title">🤖 Assistente IA</span></div>
                <div className="ia-box">
                  <div className="ia-tag">BridgeIA</div>
                  <div className="ia-msg">{iaResp}</div>
                </div>
                <div className="ia-input-wrap">
                  <input className="ia-input" placeholder="Ex: quando vence o DAS?" value={iaInput} onChange={e => setIaInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleIa()} />
                  <button className="ia-send" onClick={handleIa}>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};