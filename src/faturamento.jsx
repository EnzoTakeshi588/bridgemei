const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .fat-page { min-height: 100vh; background: #0a0a0f; color: #f8f8ff; font-family: 'DM Sans', sans-serif; padding: 36px 40px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .page-greeting { font-size: 11px; color: rgba(248,248,255,0.2); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; letter-spacing: -0.5px; margin-bottom: 28px; }
  .page-title em { font-style: italic; color: #6366f1; }
  .fat-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .fat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 22px; transition: border-color 0.2s; }
  .fat-card:hover { border-color: rgba(255,255,255,0.15); }
  .fat-card-label { font-size: 11px; color: rgba(248,248,255,0.25); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
  .fat-card-value { font-family: 'DM Serif Display', serif; font-size: 30px; letter-spacing: -1px; margin-bottom: 6px; }
  .fat-card-sub { font-size: 12px; color: rgba(248,248,255,0.35); }
  .tag-warn { color: #f59e0b; }
  .tag-ok { color: #22c55e; }
  .tag-danger { color: #ef4444; }
  .big-bar-wrap { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
  .big-bar-label { font-size: 13px; font-weight: 500; margin-bottom: 16px; display: flex; justify-content: space-between; }
  .big-bar-track { background: rgba(255,255,255,0.07); border-radius: 8px; height: 12px; overflow: hidden; margin-bottom: 10px; }
  .big-bar-fill { height: 100%; border-radius: 8px; transition: width 1.2s ease; }
  .big-bar-info { display: flex; justify-content: space-between; font-size: 12px; color: rgba(248,248,255,0.35); }
  .section-label { font-size: 11px; color: rgba(248,248,255,0.25); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; font-weight: 500; }
  .meses-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .mes-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px 10px; text-align: center; }
  .mes-nome { font-size: 11px; color: rgba(248,248,255,0.3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .mes-valor { font-size: 14px; font-weight: 500; color: #f8f8ff; margin-bottom: 6px; }
  .mes-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; }
  .mes-bar-fill { height: 100%; border-radius: 4px; }
`;

const meses = [
  { nome: "Jan", valor: 5200, cor: "#6366f1" },
  { nome: "Fev", valor: 4800, cor: "#6366f1" },
  { nome: "Mar", valor: 6100, cor: "#6366f1" },
  { nome: "Abr", valor: 7400, cor: "#6366f1" },
  { nome: "Mai", valor: 6300, cor: "#6366f1" },
  { nome: "Jun", valor: 8200, cor: "#6366f1" },
  { nome: "Jul", valor: 7100, cor: "#6366f1" },
  { nome: "Ago", valor: 5900, cor: "#6366f1" },
  { nome: "Set", valor: 4700, cor: "#6366f1" },
  { nome: "Out", valor: 5800, cor: "#6366f1" },
  { nome: "Nov", valor: 3900, cor: "#f59e0b" },
  { nome: "Dez", valor: 3000, cor: "#f59e0b" },
];

const totalFat = 68400;
const limite = 81000;
const pct = Math.round((totalFat / limite) * 100);
const maiorMes = Math.max(...meses.map(m => m.valor));

export default function Faturamento() {
  return (
    <>
      <style>{styles}</style>
      <div className="fat-page">
        <div className="page-greeting">Financeiro</div>
        <h1 className="page-title">Dashboard de <em>faturamento</em></h1>

        <div className="fat-cards">
          <div className="fat-card">
            <div className="fat-card-label">Faturamento acumulado</div>
            <div className="fat-card-value">R$ 68.400</div>
            <div className="fat-card-sub"><span className="tag-warn">{pct}% do limite anual</span></div>
          </div>
          <div className="fat-card">
            <div className="fat-card-label">Limite MEI 2024</div>
            <div className="fat-card-value">R$ 81.000</div>
            <div className="fat-card-sub">Restam <span className="tag-ok">R$ 12.600</span></div>
          </div>
          <div className="fat-card">
            <div className="fat-card-label">Melhor mês</div>
            <div className="fat-card-value">R$ 8.200</div>
            <div className="fat-card-sub">Junho/2024</div>
          </div>
        </div>

        <div className="big-bar-wrap">
          <div className="big-bar-label">
            <span>Progresso do limite anual</span>
            <span className="tag-warn">{pct}%</span>
          </div>
          <div className="big-bar-track">
            <div className="big-bar-fill" style={{ width: `${pct}%`, background: pct > 85 ? "#ef4444" : "#f59e0b" }} />
          </div>
          <div className="big-bar-info">
            <span>R$ 0</span>
            <span>⚠️ Zona de atenção a partir de 80%</span>
            <span>R$ 81.000</span>
          </div>
        </div>

        <div className="section-label">Faturamento por mês</div>
        <div className="meses-grid">
          {meses.map((m, i) => (
            <div key={i} className="mes-card">
              <div className="mes-nome">{m.nome}</div>
              <div className="mes-valor">R$ {(m.valor / 1000).toFixed(1)}k</div>
              <div className="mes-bar">
                <div className="mes-bar-fill" style={{ width: `${(m.valor / maiorMes) * 100}%`, background: m.cor }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
