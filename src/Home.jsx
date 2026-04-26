import { useState } from "react";

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
  }
  .panel-wrap { width: 100%; max-width: 480px; padding: 32px 20px; }
  .header { text-align: center; margin-bottom: 48px; animation: fadeUp 0.5s ease both; }
  .logo-name { font-family: 'DM Serif Display', serif; font-size: 28px; }
  .logo-name span { color: var(--accent); }
  .logo-tag { font-size: 11px; color: var(--text3); letter-spacing: 2.5px; text-transform: uppercase; margin-top: 4px; }
  .greeting { margin-top: 20px; }
  .greeting-sub { font-size: 11px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .greeting-title { font-family: 'DM Serif Display', serif; font-size: 32px; }
  .greeting-title em { font-style: italic; color: var(--accent); }
  .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; animation: fadeUp 0.5s 0.15s ease both; }
  .module-btn {
    position: relative; overflow: hidden; border-radius: 20px;
    border: 1px solid var(--border); background: var(--surface);
    padding: 28px 22px 24px; cursor: pointer; text-align: left;
    transition: transform 0.2s ease, border-color 0.2s, background 0.2s;
    display: flex; flex-direction: column; gap: 14px; min-height: 190px;
    font-family: 'DM Sans', sans-serif; color: var(--text);
  }
  .module-btn:hover { transform: translateY(-4px); }
  .module-btn.mei  { border-color: var(--accent-border); }
  .module-btn.mei:hover  { border-color: var(--accent); background: var(--accent-glow); }
  .module-btn.estoque { border-color: var(--green-border); }
  .module-btn.estoque:hover { border-color: var(--green); background: var(--green-glow); }
  .module-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .mei     .module-icon { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); }
  .estoque .module-icon { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.2); }
  .module-name { font-family: 'DM Serif Display', serif; font-size: 22px; }
  .module-desc { font-size: 12px; color: var(--text2); line-height: 1.5; flex: 1; }
  .module-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px; width: fit-content;
  }
  .mei     .module-badge { background: rgba(99,102,241,0.1);  border: 1px solid rgba(99,102,241,0.25); color: var(--accent); }
  .estoque .module-badge { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);  color: #f59e0b; }
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #1a1a28; border: 1px solid rgba(245,158,11,0.3);
    color: rgba(245,158,11,0.9); font-size: 13px; font-weight: 500;
    padding: 12px 20px; border-radius: 12px; font-family: 'DM Sans', sans-serif;
    animation: slideUp 0.3s ease;
  }
  @keyframes fadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
`;

export default function Home({ onNavegar }) {
  const [toast, setToast] = useState(false);

  const abrirEstoque = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2800);
    // futuramente: onNavegar("estoque")
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="panel-wrap">
          <div className="header">
            <div className="logo-name">Bridge<span>MEI</span></div>
            <div className="logo-tag">Gestão simplificada</div>
            <div className="greeting">
              <div className="greeting-sub">Bem-vinda de volta</div>
              <div className="greeting-title">Olá, <em>Tassi</em> 👋</div>
            </div>
          </div>

          <div className="panel">
            {/* ✅ Navega para "mei" */}
            <button className="module-btn mei" onClick={() => onNavegar("mei")}>
              <div className="module-icon">🧾</div>
              <div className="module-name">MEI</div>
              <div className="module-desc">DAS, declarações e faturamento do seu CNPJ.</div>
              <span className="module-badge">Ativo</span>
            </button>

            {/* 🚧 Em breve */}
            <button className="module-btn estoque" onClick={abrirEstoque}>
              <div className="module-icon">📦</div>
              <div className="module-name">Estoque</div>
              <div className="module-desc">Produtos, entradas, saídas e inventário.</div>
              <span className="module-badge">Em breve</span>
            </button>
          </div>
        </div>

        {toast && (
          <div className="toast">🚧 Estoque ainda não está disponível</div>
        )}
      </div>
    </>
  );
}
