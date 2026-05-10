import { useState, useEffect, useRef } from "react";
import { getUserFromToken } from "./utils/auth";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #0a0a0f; --text: #f8f8ff; --text2: rgba(248,248,255,0.45); --text3: rgba(248,248,255,0.2);
    --accent: #6366f1; --accent-glow: rgba(99,102,241,0.1); --accent-border: rgba(99,102,241,0.35);
    --green: #22c55e; --green-glow: rgba(34,197,94,0.1); --green-border: rgba(34,197,94,0.3);
    --surface: rgba(255,255,255,0.04); --border: rgba(255,255,255,0.08);
  }

  .app {
    font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh;
    display: flex; align-items: center; justify-content: center; color: var(--text);
    position: relative; overflow: hidden;
  }
  .app::before {
    content: ''; position: absolute; inset: -50%;
    background: radial-gradient(circle at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(34,197,94,0.06) 0%, transparent 50%),
                radial-gradient(circle at 50% 80%, rgba(99,102,241,0.05) 0%, transparent 50%);
    animation: bgMove 20s ease-in-out infinite alternate;
    z-index: 0; pointer-events: none;
  }
  @keyframes bgMove {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-2%, 2%) scale(1.05); }
    100% { transform: translate(2%, -1%) scale(1); }
  }

  .panel-wrap { width: 100%; max-width: 480px; padding: 32px 20px; position: relative; z-index: 1; }

  .header { text-align: center; margin-bottom: 48px; }
  .logo-name {
    font-family: 'DM Serif Display', serif; font-size: 28px;
    opacity: 0; animation: fadeDown 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .logo-name span { color: var(--accent); }
  .logo-tag {
    font-size: 11px; color: var(--text3); letter-spacing: 2.5px; text-transform: uppercase; margin-top: 4px;
    opacity: 0; animation: fadeDown 0.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .greeting {
    margin-top: 20px;
    opacity: 0; animation: fadeDown 0.6s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .greeting-sub { font-size: 11px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .greeting-title { font-family: 'DM Serif Display', serif; font-size: 32px; }
  .greeting-title em { font-style: italic; color: var(--accent); }

  .typing-cursor::after {
    content: '|'; animation: blink 1s step-end infinite; margin-left: 2px;
  }
  @keyframes blink { 50% { opacity: 0; } }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .module-btn {
    position: relative; overflow: hidden; border-radius: 20px;
    border: 1px solid var(--border); background: var(--surface);
    padding: 28px 22px 24px; cursor: pointer; text-align: left;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, background 0.3s, box-shadow 0.3s;
    display: flex; flex-direction: column; gap: 14px; min-height: 190px;
    font-family: 'DM Sans', sans-serif; color: var(--text);
    opacity: 0; transform: translateY(30px) scale(0.95);
  }
  .module-btn.visible {
    animation: cardEnter 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .module-btn:nth-child(1).visible { animation-delay: 0.35s; }
  .module-btn:nth-child(2).visible { animation-delay: 0.5s; }

  @keyframes cardEnter {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .module-btn:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .module-btn.mei { border-color: var(--accent-border); }
  .module-btn.mei:hover { border-color: var(--accent); background: var(--accent-glow); box-shadow: 0 20px 40px rgba(99,102,241,0.15); }
  .module-btn.estoque { border-color: var(--green-border); }
  .module-btn.estoque:hover { border-color: var(--green); background: var(--green-glow); box-shadow: 0 20px 40px rgba(34,197,94,0.12); }

  .ripple {
    position: absolute; border-radius: 50%; transform: scale(0);
    animation: rippleAnim 0.6s linear; pointer-events: none;
    background: rgba(255,255,255,0.25);
  }
  @keyframes rippleAnim {
    to { transform: scale(4); opacity: 0; }
  }

  .module-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 22px;
    animation: float 3s ease-in-out infinite;
  }
  .module-btn:nth-child(2) .module-icon { animation-delay: 0.5s; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .mei     .module-icon { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); }
  .estoque .module-icon { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.2); }

  .module-name { font-family: 'DM Serif Display', serif; font-size: 22px; }
  .module-desc { font-size: 12px; color: var(--text2); line-height: 1.5; flex: 1; }

  .module-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px; width: fit-content;
    animation: badgePulse 2s ease-in-out infinite;
  }
  @keyframes badgePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(0.97); }
  }
  .mei     .module-badge { background: rgba(99,102,241,0.1);  border: 1px solid rgba(99,102,241,0.25); color: var(--accent); }
  .estoque .module-badge { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);  color: #22c55e; }

  .particle {
    position: absolute; border-radius: 50%; background: var(--accent);
    opacity: 0.15; pointer-events: none; z-index: 0;
    animation: particleFloat 15s ease-in-out infinite;
  }
  @keyframes particleFloat {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
    33% { transform: translate(20px, -30px) scale(1.2); opacity: 0.08; }
    66% { transform: translate(-15px, 20px) scale(0.8); opacity: 0.2; }
  }
`;

export default function Home({ onNavegar }) {
  const [displayName, setDisplayName] = useState("");
  const [panelVisible, setPanelVisible] = useState(false);
  const user = getUserFromToken();
  const nome = user?.nome || "";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayName(nome.slice(0, i + 1));
      i++;
      if (i >= nome.length) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
  }, [nome]);

  useEffect(() => {
    const t = setTimeout(() => setPanelVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const createRipple = (e, btnRef) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.className = "ripple";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const meiRef = useRef(null);
  const estoqueRef = useRef(null);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="particle" style={{ width: 120, height: 120, top: '10%', left: '5%', animationDelay: '0s' }} />
        <div className="particle" style={{ width: 80, height: 80, top: '60%', right: '8%', animationDelay: '5s', background: 'var(--green)' }} />
        <div className="particle" style={{ width: 60, height: 60, bottom: '15%', left: '15%', animationDelay: '10s' }} />

        <div className="panel-wrap">
          <div className="header">
            <div className="logo-name">Bridge<span>MEI</span></div>
            <div className="logo-tag">Gestão simplificada</div>
            <div className="greeting">
              <div className="greeting-sub">Bem-vinda de volta</div>
              <div className="greeting-title">
                Olá, <em className="typing-cursor">{displayName}</em> 👋
              </div>
            </div>
          </div>

          <div className="panel">
            {/* Botão MEI */}
            <button
              ref={meiRef}
              className={`module-btn mei ${panelVisible ? "visible" : ""}`}
              onClick={(e) => {
                createRipple(e, meiRef);
                setTimeout(() => onNavegar("mei"), 200);
              }}
            >
              <div className="module-icon">🧾</div>
              <div className="module-name">MEI</div>
              <div className="module-desc">DAS, declarações e faturamento do seu CNPJ.</div>
              <span className="module-badge">Ativo</span>
            </button>

            {/* Botão Estoque */}
            <button
              ref={estoqueRef}
              className={`module-btn estoque ${panelVisible ? "visible" : ""}`}
              onClick={(e) => {
                createRipple(e, estoqueRef);
                setTimeout(() => onNavegar("estoque"), 200);
              }}
            >
              <div className="module-icon">📦</div>
              <div className="module-name">Estoque</div>
              <div className="module-desc">Produtos, entradas, saídas e inventário.</div>
              <span className="module-badge">Disponível</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}