import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .docs-page { min-height: 100vh; background: #0a0a0f; color: #f8f8ff; font-family: 'DM Sans', sans-serif; padding: 36px 40px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .page-greeting { font-size: 11px; color: rgba(248,248,255,0.2); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; letter-spacing: -0.5px; margin-bottom: 28px; }
  .page-title em { font-style: italic; color: #6366f1; }
  .upload-area { border: 1.5px dashed rgba(99,102,241,0.3); border-radius: 14px; padding: 36px; text-align: center; cursor: pointer; background: rgba(99,102,241,0.03); transition: all 0.2s; margin-bottom: 28px; }
  .upload-area:hover { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.06); }
  .upload-icon { font-size: 32px; margin-bottom: 10px; }
  .upload-title { font-size: 14px; font-weight: 500; color: #f8f8ff; margin-bottom: 4px; }
  .upload-sub { font-size: 12px; color: rgba(248,248,255,0.3); }
  .upload-btn { margin-top: 14px; padding: 9px 20px; background: #6366f1; border: none; border-radius: 8px; color: white; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .upload-btn:hover { background: #5254cc; }
  .docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
  .doc-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.2s; }
  .doc-card:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }
  .doc-icon-big { font-size: 28px; margin-bottom: 12px; }
  .doc-name { font-size: 13.5px; font-weight: 500; color: #f8f8ff; margin-bottom: 4px; }
  .doc-meta { font-size: 11.5px; color: rgba(248,248,255,0.35); }
  .doc-tag { display: inline-block; margin-top: 10px; font-size: 10px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; }
  .doc-tag.fiscal { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.25); }
  .doc-tag.pendente { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
  .doc-tag.ok { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
  .section-title { font-size: 11px; color: rgba(248,248,255,0.25); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; font-weight: 500; }
  .success-toast { position: fixed; bottom: 24px; right: 24px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 12px 20px; border-radius: 10px; font-size: 13px; animation: fadeIn 0.3s ease; }
`;

const docs = [
  { icon: "📄", nome: "DAS_maio_2025.pdf", meta: "Enviado há 3 dias · 42 KB", tag: "fiscal", tagLabel: "Fiscal" },
  { icon: "📊", nome: "Faturamento_Q1.pdf", meta: "Enviado há 1 semana · 128 KB", tag: "ok", tagLabel: "Aprovado" },
  { icon: "📋", nome: "DASN_2023.pdf", meta: "Enviado há 2 meses · 88 KB", tag: "ok", tagLabel: "Aprovado" },
  { icon: "🧾", nome: "NF_servico_abr.pdf", meta: "Aguardando revisão · 56 KB", tag: "pendente", tagLabel: "Pendente" },
  { icon: "📄", nome: "Contrato_MEI.pdf", meta: "Aguardando revisão · 210 KB", tag: "pendente", tagLabel: "Pendente" },
  { icon: "📊", nome: "Relatorio_anual.pdf", meta: "Enviado há 3 meses · 340 KB", tag: "ok", tagLabel: "Aprovado" },
  { icon: "🧾", nome: "NF_produto_mar.pdf", meta: "Enviado há 1 mês · 64 KB", tag: "fiscal", tagLabel: "Fiscal" },
];

export default function Documentos() {
  const [toast, setToast] = useState(false);

  const simularUpload = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="docs-page">
        <div className="page-greeting">Gestão</div>
        <h1 className="page-title">Seus <em>documentos</em></h1>

        <div className="upload-area" onClick={simularUpload}>
          <div className="upload-icon">📤</div>
          <div className="upload-title">Enviar novo documento</div>
          <div className="upload-sub">PDF, imagem ou planilha · Máx. 10MB</div>
          <button className="upload-btn">Selecionar arquivo</button>
        </div>

        <div className="section-title">Todos os documentos ({docs.length})</div>
        <div className="docs-grid">
          {docs.map((d, i) => (
            <div key={i} className="doc-card">
              <div className="doc-icon-big">{d.icon}</div>
              <div className="doc-name">{d.nome}</div>
              <div className="doc-meta">{d.meta}</div>
              <span className={`doc-tag ${d.tag}`}>{d.tagLabel}</span>
            </div>
          ))}
        </div>

        {toast && <div className="success-toast">✓ Documento enviado com sucesso!</div>}
      </div>
    </>
  );
}
