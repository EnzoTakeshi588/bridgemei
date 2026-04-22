const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .alerts-page { min-height: 100vh; background: #0a0a0f; color: #f8f8ff; font-family: 'DM Sans', sans-serif; padding: 36px 40px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .page-greeting { font-size: 11px; color: rgba(248,248,255,0.2); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; letter-spacing: -0.5px; margin-bottom: 28px; }
  .page-title em { font-style: italic; color: #6366f1; }
  .alert-list { display: flex; flex-direction: column; gap: 12px; max-width: 700px; }
  .alert-card { display: flex; align-items: flex-start; gap: 16px; padding: 20px; border-radius: 14px; border: 1px solid; transition: all 0.2s; }
  .alert-card.danger { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.2); }
  .alert-card.warn { background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.2); }
  .alert-card.ok { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.15); }
  .alert-card.info { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.2); }
  .alert-card:hover { filter: brightness(1.1); }
  .alert-emoji { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
  .alert-content { flex: 1; }
  .alert-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
  .alert-card.danger .alert-title { color: #f87171; }
  .alert-card.warn .alert-title { color: #fbbf24; }
  .alert-card.ok .alert-title { color: #4ade80; }
  .alert-card.info .alert-title { color: #818cf8; }
  .alert-desc { font-size: 13px; color: rgba(248,248,255,0.5); line-height: 1.5; }
  .alert-date { font-size: 11px; color: rgba(248,248,255,0.25); margin-top: 6px; }
  .section-label { font-size: 11px; color: rgba(248,248,255,0.25); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; margin-top: 28px; font-weight: 500; }
`;

const alertas = [
  { tipo: "danger", emoji: "🚨", titulo: "DAS vence em 6 dias!", desc: "O DAS de maio/2025 no valor de R$ 72,60 vence em 20/05/2025. Não pague com atraso para evitar multa.", data: "Hoje" },
  { tipo: "warn", emoji: "📊", titulo: "84% do limite de faturamento atingido", desc: "Você faturou R$ 68.400 dos R$ 81.000 permitidos no ano. Atenção para não ultrapassar.", data: "Atualizado hoje" },
  { tipo: "warn", emoji: "📋", titulo: "2 documentos aguardando revisão", desc: "O contador Silva ainda não revisou 2 documentos enviados. Verifique na aba Documentos.", data: "Há 3 dias" },
  { tipo: "ok", emoji: "✅", titulo: "DASN-SIMEI entregue com sucesso", desc: "A declaração anual de 2023 foi entregue e aprovada pela Receita Federal.", data: "Há 2 meses" },
  { tipo: "ok", emoji: "✅", titulo: "DAS de abril pago", desc: "O DAS de abril/2025 foi pago e confirmado. Tudo em dia!", data: "Há 20 dias" },
  { tipo: "info", emoji: "📚", titulo: "Nova reforma tributária — saiba o que muda", desc: "A reforma tributária traz o IBS e a CBS. Acesse o módulo educativo para entender o impacto no seu negócio.", data: "Há 1 semana" },
];

export default function Alertas() {
  const ativos = alertas.filter(a => a.tipo === "danger" || a.tipo === "warn");
  const resolvidos = alertas.filter(a => a.tipo === "ok" || a.tipo === "info");

  return (
    <>
      <style>{styles}</style>
      <div className="alerts-page">
        <div className="page-greeting">Notificações</div>
        <h1 className="page-title">Seus <em>alertas</em></h1>

        <div className="section-label" style={{ marginTop: 0 }}>Atenção necessária ({ativos.length})</div>
        <div className="alert-list">
          {ativos.map((a, i) => (
            <div key={i} className={`alert-card ${a.tipo}`}>
              <span className="alert-emoji">{a.emoji}</span>
              <div className="alert-content">
                <div className="alert-title">{a.titulo}</div>
                <div className="alert-desc">{a.desc}</div>
                <div className="alert-date">{a.data}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-label">Resolvidos e informativos ({resolvidos.length})</div>
        <div className="alert-list">
          {resolvidos.map((a, i) => (
            <div key={i} className={`alert-card ${a.tipo}`}>
              <span className="alert-emoji">{a.emoji}</span>
              <div className="alert-content">
                <div className="alert-title">{a.titulo}</div>
                <div className="alert-desc">{a.desc}</div>
                <div className="alert-date">{a.data}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
