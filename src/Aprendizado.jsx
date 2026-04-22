import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  .edu-page { min-height: 100vh; background: #0a0a0f; color: #f8f8ff; font-family: 'DM Sans', sans-serif; padding: 36px 40px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .page-greeting { font-size: 11px; color: rgba(248,248,255,0.2); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 30px; letter-spacing: -0.5px; margin-bottom: 28px; }
  .page-title em { font-style: italic; color: #6366f1; }
  .edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .edu-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px; cursor: pointer; transition: all 0.2s; }
  .edu-card:hover { border-color: rgba(99,102,241,0.35); background: rgba(99,102,241,0.05); transform: translateY(-2px); }
  .edu-card.open { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.06); }
  .edu-emoji { font-size: 26px; margin-bottom: 12px; }
  .edu-titulo { font-size: 15px; font-weight: 600; color: #f8f8ff; margin-bottom: 6px; }
  .edu-desc { font-size: 13px; color: rgba(248,248,255,0.4); line-height: 1.5; margin-bottom: 14px; }
  .edu-tag { font-size: 10px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; padding: 3px 10px; border-radius: 6px; background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); }
  .edu-content { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.07); font-size: 13.5px; color: rgba(248,248,255,0.6); line-height: 1.7; }
  .edu-content strong { color: #f8f8ff; font-weight: 500; }
`;

const conteudos = [
  {
    emoji: "💰",
    titulo: "O que é o DAS?",
    desc: "Entenda o Documento de Arrecadação do Simples e como funciona o pagamento mensal.",
    tag: "Básico",
    conteudo: <><strong>DAS</strong> (Documento de Arrecadação do Simples Nacional) é o boleto mensal do MEI. Ele cobre o INSS (previdência social), ISS (serviços) e/ou ICMS (comércio/indústria).<br /><br />O valor em 2024 é de <strong>R$ 71,60</strong> para comércio/indústria e <strong>R$ 75,60</strong> para serviços.<br /><br />⏰ <strong>Vence todo dia 20</strong> do mês seguinte ao de referência. Pague pelo app do banco ou no site da Receita Federal.</>,
  },
  {
    emoji: "📋",
    titulo: "O que é a DASN-SIMEI?",
    desc: "A declaração anual obrigatória do MEI e como não perder o prazo.",
    tag: "Obrigação",
    conteudo: <><strong>DASN-SIMEI</strong> é a Declaração Anual de Faturamento do MEI. É obrigatória mesmo que você não tenha faturado nada no ano.<br /><br />📅 <strong>Prazo: até 31 de maio</strong> de cada ano, referente ao ano anterior.<br /><br />Você pode entregar pelo Portal do Empreendedor (gov.br). Não entregar gera multa e pode levar ao cancelamento do CNPJ.</>,
  },
  {
    emoji: "🏦",
    titulo: "Limite de faturamento do MEI",
    desc: "Quanto você pode faturar por ano e o que acontece se ultrapassar.",
    tag: "Importante",
    conteudo: <>O MEI pode faturar até <strong>R$ 81.000 por ano</strong> (R$ 6.750/mês em média).<br /><br />Se ultrapassar até 20% do limite, você é enquadrado como Microempresa (ME). Se ultrapassar mais de 20%, pode perder os benefícios retroativamente e pagar mais imposto.<br /><br />⚠️ <strong>Fique atento!</strong> Seu faturamento atual já está em 84% do limite.</>,
  },
  {
    emoji: "📄",
    titulo: "Nota Fiscal do MEI",
    desc: "Quando emitir, como emitir e diferença entre NF de serviço e produto.",
    tag: "Prática",
    conteudo: <>O MEI pode emitir dois tipos de nota fiscal:<br /><br /><strong>NFS-e (Nota de Serviço):</strong> Emitida pelo sistema da prefeitura do seu município. Necessária para prestar serviços a pessoas jurídicas (empresas).<br /><br /><strong>NF de Produto:</strong> Emitida pelo sistema da SEFAZ estadual. Necessária para venda de mercadorias para empresas.<br /><br />Para vendas a pessoas físicas, a nota fiscal <strong>não é obrigatória</strong>, mas recomendada.</>,
  },
  {
    emoji: "🔄",
    titulo: "IBS e CBS — Reforma Tributária",
    desc: "O que muda com a reforma tributária e como o MEI é afetado.",
    tag: "Novo",
    conteudo: <>A reforma tributária aprovada em 2023 cria dois novos impostos:<br /><br /><strong>CBS</strong> (federal) substitui PIS e COFINS.<br /><strong>IBS</strong> (estadual/municipal) substitui ICMS e ISS.<br /><br />O MEI <strong>está protegido</strong> por regras específicas e não deve sofrer impacto imediato. A transição ocorre de 2026 a 2032. Fique atento às atualizações no módulo educativo!</>,
  },
  {
    emoji: "🛡️",
    titulo: "Benefícios do MEI",
    desc: "Aposentadoria, auxílio-doença, salário-maternidade e outros direitos.",
    tag: "Direitos",
    conteudo: <>Ao pagar o DAS em dia, o MEI tem direito a:<br /><br />✅ <strong>Aposentadoria por idade</strong> (65H / 62M)<br />✅ <strong>Auxílio-doença</strong> após 12 meses de contribuição<br />✅ <strong>Salário-maternidade</strong> após 10 meses<br />✅ <strong>Pensão por morte</strong> para dependentes<br />✅ <strong>CNPJ gratuito</strong> e emissão de nota fiscal<br /><br />Para garantir esses direitos, <strong>nunca atrase o DAS!</strong></>,
  },
];

export default function Aprendizado() {
  const [aberto, setAberto] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <div className="edu-page">
        <div className="page-greeting">Conteúdo</div>
        <h1 className="page-title">Módulo de <em>aprendizado</em></h1>
        <div className="edu-grid">
          {conteudos.map((c, i) => (
            <div key={i} className={`edu-card ${aberto === i ? "open" : ""}`} onClick={() => setAberto(aberto === i ? null : i)}>
              <div className="edu-emoji">{c.emoji}</div>
              <div className="edu-titulo">{c.titulo}</div>
              <div className="edu-desc">{c.desc}</div>
              <span className="edu-tag">{c.tag}</span>
              {aberto === i && <div className="edu-content">{c.conteudo}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
