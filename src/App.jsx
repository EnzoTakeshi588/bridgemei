import { useState, useEffect } from 'react'
import Login from './Login'
import Home from './Home'
import MEI from './Mei'          // ✅ ADICIONADO
import Chat from './Chat'
import Documentos from './Documentos'
import Alertas from './Alertas'
import Faturamento from './faturamento'
import Aprendizado from './Aprendizado'
import { getUserFromToken, logout } from './utils/auth'

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .layout { display: flex; min-height: 100vh; }
  .shared-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; width: 240px;
    background: #0d0d15; border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column; padding: 28px 0; z-index: 100;
    font-family: 'DM Sans', sans-serif;
  }
  .sb-logo { padding: 0 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 16px; }
  .sb-logo-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: #f8f8ff; }
  .sb-logo-name span { color: #6366f1; }
  .sb-logo-tag { font-size: 10px; color: rgba(248,248,255,0.2); letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }
  .sb-nav { flex: 1; padding: 0 12px; }
  .sb-section { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(248,248,255,0.2); padding: 16px 12px 8px; }
  .sb-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    border-radius: 8px; cursor: pointer; transition: all 0.15s;
    color: rgba(248,248,255,0.4); font-size: 13.5px; margin-bottom: 2px;
    border: 1px solid transparent; background: none;
    width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .sb-item:hover { background: rgba(255,255,255,0.07); color: #f8f8ff; }
  .sb-item.active { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.3); color: #f8f8ff; font-weight: 500; }
  .sb-icon { font-size: 15px; width: 20px; text-align: center; }
  .sb-badge { margin-left: auto; background: #ef4444; color: white; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 10px; }
  .sb-footer { padding: 16px 12px 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 0 12px; }
  .sb-user { display: flex; align-items: center; gap: 10px; padding: 10px 0; }
  .sb-avatar { width: 34px; height: 34px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #6366f1; flex-shrink: 0; }
  .sb-name { font-size: 13px; color: #f8f8ff; font-weight: 500; }
  .sb-role { font-size: 11px; color: rgba(248,248,255,0.2); }
  .page-content { margin-left: 240px; flex: 1; }
`;

const navItems = [
  { id: "home", icon: "⊞", label: "Início" },
  { id: "chat", icon: "💬", label: "Mensagens", badge: 2 },
  { id: "docs", icon: "📁", label: "Documentos" },
  { id: "alerts", icon: "🔔", label: "Alertas", badge: 1 },
  { id: "dashboard", icon: "📊", label: "Faturamento" },
  { id: "edu", icon: "📚", label: "Aprendizado" },
];

function SharedLayout({ tela, onNavegar }) {
  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="layout">
        <aside className="shared-sidebar">
          <div className="sb-logo">
            <div className="sb-logo-name">Bridge<span>MEI</span></div>
            <div className="sb-logo-tag">Gestão simplificada</div>
          </div>
          <nav className="sb-nav">
            <div className="sb-section">Menu</div>
            {navItems.map(item => (
              <button key={item.id} className={`sb-item ${tela === item.id ? "active" : ""}`} onClick={() => onNavegar(item.id)}>
                <span className="sb-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="sb-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-avatar">T</div>
              <div>
                <div className="sb-name">Tassi</div>
                <div className="sb-role">MEI · Autônoma</div>
              </div>
            </div>
          </div>
        </aside>
        <div className="page-content">
          {tela === "chat"      && <Chat />}
          {tela === "docs"      && <Documentos />}
          {tela === "alerts"    && <Alertas />}
          {tela === "dashboard" && <Faturamento />}
          {tela === "edu"       && <Aprendizado />}
        </div>
      </div>
    </>
  );
}

function App() {
  const [logado, setLogado] = useState(() => Boolean(getUserFromToken()));
  const [tela, setTela] = useState(() => localStorage.getItem("ultimaPagina") || "home");

  useEffect(() => {
    localStorage.setItem("ultimaPagina", tela);
  }, [tela]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("ultimaPagina");
    setLogado(false);
    setTela("home");
  };

  if (!logado) return <Login onLogin={() => setLogado(true)} />;
  if (tela === "home") return <Home onNavegar={setTela} />;
  if (tela === "mei")  return <MEI onNavegar={setTela} onLogout={handleLogout} />;  // ✅ ADICIONADO
  return <SharedLayout tela={tela} onNavegar={setTela} />;
}

export default App;
