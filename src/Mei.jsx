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

  .app {
    font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text);
    position: relative; overflow-x: hidden;
  }
  .app::before {
    content: ''; position: fixed; inset: -50%;
    background: radial-gradient(circle at 15% 30%, rgba(99,102,241,0.06) 0%, transparent 50%),
                radial-gradient(circle at 85% 70%, rgba(34,197,94,0.04) 0%, transparent 50%);
    animation: bgMove 25s ease-in-out infinite alternate;
    z-index: 0; pointer-events: none;
  }
  @keyframes bgMove {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-3%, 3%) scale(1.08); }
    100% { transform: translate(2%, -2%) scale(1); }
  }

  .particle {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    animation: particleFloat 20s ease-in-out infinite;
  }
  @keyframes particleFloat {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
    33% { transform: translate(30px, -40px) scale(1.3); opacity: 0.05; }
    66% { transform: translate(-20px, 30px) scale(0.8); opacity: 0.12; }
  }

  .header {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 32px; max-width: 1200px; margin: 0 auto;
    animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .header-logo { font-family: 'DM Serif Display', serif; font-size: 22px; }
  .header-logo span { color: var(--accent); }
  .header-nav { display: flex; gap: 6px; align-items: center; }
  .nav-pill {
    padding: 8px 16px; border-radius: 20px; border: 1px solid transparent;
    background: none; color: var(--text2); font-family: 'DM Sans', sans-serif;
    font-size: 13px; cursor: pointer; transition: all 0.2s ease;
  }
  .nav-pill:hover { background: var(--surface); color: var(--text); }
  .nav-pill.active { background: var(--accent-glow); border-color: var(--accent-border); color: var(--text); font-weight: 500; }
  .nav-pill .badge {
    display: inline-block; margin-left: 6px; background: var(--danger); color: white;
    font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 8px; min-width: 16px; text-align: center;
  }
  .header-user {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    padding: 6px 12px 6px 6px; border-radius: 24px; border: 1px solid var(--border);
    background: var(--surface); transition: all 0.2s;
  }
  .header-user:hover { border-color: var(--accent-border); background: var(--accent-glow); }
  .header-avatar {
    width: 30px; height: 30px; background: var(--accent-glow); border: 1px solid var(--accent-border);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: var(--accent);
  }

  .main { position: relative; z-index: 1; padding: 0 32px 40px; max-width: 1200px; margin: 0 auto; }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.2); }
    50% { box-shadow: 0 0 20px 4px rgba(99,102,241,0.1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .greeting-wrap {
    margin-bottom: 28px;
    animation: fadeUp 0.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .greeting-sub { font-size: 11px; color: var(--text3); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
  .greeting-title { font-family: 'DM Serif Display', serif; font-size: 32px; }
  .greeting-title em { font-style: italic; color: var(--accent); }

  .alert-banner {
    background: var(--warning-bg); border: 1px solid var(--warning-border);
    border-radius: 14px; padding: 14px 18px;
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
    font-size: 13.5px; color: rgba(245,158,11,0.9);
    animation: slideRight 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
    position: relative; overflow: hidden;
  }
  .alert-banner::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--warning); border-radius: 14px 0 0 14px;
  }
  .alert-banner strong { font-weight: 600; color: var(--warning); }
  .alert-action {
    margin-left: auto; background: var(--warning); color: #0a0a0f;
    border: none; border-radius: 8px; padding: 7px 16px;
    font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .alert-action:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }

  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;
  }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 22px; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    opacity: 0; transform: translateY(20px) scale(0.96);
  }
  .stat-card.visible {
    animation: scaleIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .stat-card:nth-child(1).visible { animation-delay: 0.25s; }
  .stat-card:nth-child(2).visible { animation-delay: 0.35s; }
  .stat-card:nth-child(3).visible { animation-delay: 0.45s; }
  .stat-card:nth-child(4).visible { animation-delay: 0.55s; }
  .stat-card:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: var(--accent-border);
    background: var(--surface2);
    box-shadow: 0 16px 40px rgba(0,0,0,0.25);
  }
  .stat-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    margin-bottom: 14px; animation: float 3s ease-in-out infinite;
  }
  .stat-card:nth-child(1) .stat-icon { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); }
  .stat-card:nth-child(2) .stat-icon { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); animation-delay: 0.5s; }
  .stat-card:nth-child(3) .stat-icon { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); animation-delay: 1s; }
  .stat-card:nth-child(4) .stat-icon { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); animation-delay: 1.5s; }
  .stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; font-weight: 500; }
  .stat-value {
    font-family: 'DM Serif Display', serif; font-size: 26px; color: var(--text);
    letter-spacing: -1px; line-height: 1; margin-bottom: 8px;
  }
  .stat-sub { font-size: 12px; color: var(--text2); }
  .tag-ok { color: var(--success); }
  .tag-warn { color: var(--warning); }
  .fat-bar-wrap { background: rgba(255,255,255,0.06); border-radius: 6px; height: 5px; margin: 10px 0 8px; overflow: hidden; }
  .fat-bar { height: 100%; border-radius: 6px; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }

  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 22px; opacity: 0; transform: translateY(20px);
  }
  .chart-card.visible {
    animation: fadeUp 0.7s 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .chart-card:nth-child(2).visible { animation-delay: 0.65s; }
  .chart-card:hover { border-color: var(--border-hover); }

  .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .chart-title { font-size: 14px; font-weight: 500; color: var(--text); }
  .chart-badge { font-size: 11px; color: var(--text3); }
  .chart-center-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; }
  .chart-center-value { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--text); line-height: 1; }
  .chart-center-sub { font-size: 10px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 3px; }
  .pie-legend { display: flex; gap: 20px; margin-top: 14px; justify-content: center; }
  .pie-legend-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text2); }
  .pie-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }

  .bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .info-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 22px; opacity: 0; transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .info-card.visible {
    animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .info-card:nth-child(1).visible { animation-delay: 0.7s; }
  .info-card:nth-child(2).visible { animation-delay: 0.8s; }
  .info-card:nth-child(3).visible { animation-delay: 0.9s; }
  .info-card:hover {
    transform: translateY(-3px);
    border-color: var(--border-hover);
    box-shadow: 0 12px 30px rgba(0,0,0,0.2);
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 500; color: var(--text); }
  .card-link {
    font-size: 12px; color: var(--accent); cursor: pointer; font-weight: 500;
    background: none; border: none; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s;
  }
  .card-link:hover { opacity: 0.7; }

  .alert-list { display: flex; flex-direction: column; gap: 8px; }
  .alert-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 12px;
    border-radius: 10px; font-size: 13px; opacity: 0; transform: translateX(-10px);
    transition: all 0.2s;
  }
  .alert-item.visible {
    animation: slideRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .alert-item:nth-child(1).visible { animation-delay: 0.85s; }
  .alert-item:nth-child(2).visible { animation-delay: 0.95s; }
  .alert-item:nth-child(3).visible { animation-delay: 1.05s; }
  .alert-item:hover { transform: translateX(4px); }
  .alert-item.warn { background: var(--warning-bg); border: 1px solid var(--warning-border); color: rgba(245,158,11,0.85); }
  .alert-item.ok { background: var(--success-bg); border: 1px solid var(--success-border); color: rgba(34,197,94,0.85); }
  .alert-item-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .alert-item-title { font-weight: 500; font-size: 12.5px; }
  .alert-item-sub { font-size: 11.5px; opacity: 0.7; margin-top: 2px; }

  .chat-list { display: flex; flex-direction: column; gap: 4px; }
  .chat-item {
    display: flex; align-items: center; gap: 12px; padding: 10px;
    border-radius: 10px; cursor: pointer; transition: all 0.2s;
    opacity: 0; transform: translateX(-10px);
  }
  .chat-item.visible {
    animation: slideRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .chat-item:nth-child(1).visible { animation-delay: 0.9s; }
  .chat-item:nth-child(2).visible { animation-delay: 1s; }
  .chat-item:nth-child(3).visible { animation-delay: 1.1s; }
  .chat-item:hover { background: var(--surface2); transform: translateX(4px); }
  .chat-avatar {
    width: 36px; height: 36px; background: var(--accent-glow);
    border: 1px solid var(--accent-border); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: var(--accent); flex-shrink: 0;
  }
  .chat-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .chat-preview { font-size: 12px; color: var(--text2); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
  .chat-time { font-size: 11px; color: var(--text3); margin-left: auto; flex-shrink: 0; }
  .chat-unread { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; flex-shrink: 0; animation: pulseGlow 2s infinite; }

  .ia-box {
    background: var(--accent-glow); border: 1px solid var(--accent-border);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;
    min-height: 80px;
  }
  .ia-tag { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .ia-msg { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .ia-msg.typing::after {
    content: '|'; animation: blink 1s step-end infinite; margin-left: 2px;
  }
  @keyframes blink { 50% { opacity: 0; } }
  .ia-input-wrap { display: flex; gap: 8px; }
  .ia-input {
    flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.04);
    border: 1px solid var(--border); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text);
    outline: none; transition: all 0.2s;
  }
  .ia-input::placeholder { color: var(--text3); }
  .ia-input:focus { border-color: var(--accent-border); background: var(--accent-glow); }
  .ia-send {
    padding: 10px 16px; background: var(--accent); color: white;
    border: none; border-radius: 9px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;
  }
  .ia-send:hover { background: var(--accent-hover); transform: translateY(-1px); }

  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
    .bottom-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .header { padding: 16px 20px; flex-wrap: wrap; gap: 12px; }
    .header-nav { order: 3; width: 100%; overflow-x: auto; }
    .main { padding: 0 20px 32px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .bottom-grid { grid-template-columns: 1fr; }
    .greeting-title { font-size: 24px; }
  }
`;

const pct = 84;
const pieData = [
  { label: "Serviços", value: 58, color: "#6366f1" },
  { label: "Produtos", value: 27, color: "#22c55e" },
  { label: "Outros", value: 15, color: "#f59e0b" },
];
const waveMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
const waveValues = [4200, 5100, 6300, 7200, 8100, 8900, 9200, 9800];

function useTypewriter(text, speed = 30 = 30) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    setDisplay("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return display;
}

function PieChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
}
  useEffect(() => {
  if (!canvasRef.current) return;

  chartRef.current?.destroy();

  chartRef.current = new Chart(canvasRef.current, {
    type: "doughnut",
    data: {
      labels: pieData.map((d) => d.label),
      datasets: [
        {
          data: pieData.map((d) => d.value),
          backgroundColor: pieData.map((d) => d.color + "cc"),
          borderColor: pieData.map((d) => d.color),
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15,15,25,0.95)",
          titleColor: "#f8f8ff",
          bodyColor: "rgba(248,248,255,0.6)",
          borderColor: "rgba(99,102,241,0.3)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.toFixed(1)}%`,
          },
        },
      },
    },
  });
}, [pieData]);