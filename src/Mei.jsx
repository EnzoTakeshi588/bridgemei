import { useState, useEffect, useRef } from "react";
import { getUserFromToken } from "./utils/auth";
import {
  Chart, ArcElement, DoughnutController, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip,
} from "chart.js";
import "./styles/Mei.css";

Chart.register(
  ArcElement, DoughnutController, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip
);

/* ══════════════ DATA ══════════════ */
const PIE_DATA  = [{label:"Serviços",value:58,color:"#8f1d3f"},{label:"Produtos",value:27,color:"#22c55e"},{label:"Outros",value:15,color:"#f59e0b"}];
const MONTHS    = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago"];
const REVENUE   = [4200,5100,6300,7200,6100,5900,6200,6800];

const ALERTAS = [
  {tipo:"danger",emoji:"🚨",titulo:"DAS vence em 6 dias!",              desc:"O DAS de maio/2025 no valor de R$ 72,60 vence em 20/05/2025. Não pague com atraso para evitar multa.",data:"Hoje"},
  {tipo:"warn",  emoji:"📊",titulo:"84% do limite atingido",             desc:"Você faturou R$ 68.400 dos R$ 81.000 permitidos no ano. Atenção para não ultrapassar.",             data:"Atualizado hoje"},
  {tipo:"warn",  emoji:"📋",titulo:"2 documentos aguardando revisão",    desc:"O contador Silva ainda não revisou 2 documentos enviados. Verifique na aba Documentos.",           data:"Há 3 dias"},
  {tipo:"ok",    emoji:"✅",titulo:"DASN-SIMEI entregue com sucesso",    desc:"A declaração anual de 2023 foi entregue e aprovada pela Receita Federal.",                         data:"Há 2 meses"},
  {tipo:"ok",    emoji:"✅",titulo:"DAS de abril pago",                  desc:"O DAS de abril/2025 foi pago e confirmado. Tudo em dia!",                                          data:"Há 20 dias"},
  {tipo:"info",  emoji:"📚",titulo:"Nova reforma tributária",            desc:"A reforma traz o IBS e a CBS. Acesse o módulo educativo para entender o impacto no seu negócio.",  data:"Há 1 semana"},
];

const CONTEUDOS = [
  {emoji:"💰",titulo:"O que é o DAS?",         desc:"Entenda o Documento de Arrecadação do Simples e como funciona o pagamento mensal.",tag:"Básico",     conteudo:<><strong>DAS</strong> é o boleto mensal do MEI, cobrindo INSS, ISS e/ou ICMS.<br/><br/>Em 2024: <strong>R$ 71,60</strong> (comércio) ou <strong>R$ 75,60</strong> (serviços).<br/><br/>⏰ Vence todo <strong>dia 20</strong> do mês seguinte.</>},
  {emoji:"📋",titulo:"O que é a DASN-SIMEI?",  desc:"A declaração anual obrigatória do MEI e como não perder o prazo.",tag:"Obrigação", conteudo:<><strong>DASN-SIMEI</strong> é obrigatória mesmo sem faturamento.<br/><br/>📅 <strong>Prazo: 31 de maio</strong> de cada ano. Não entregar gera multa e pode cancelar o CNPJ.</>},
  {emoji:"🏦",titulo:"Limite de faturamento",   desc:"Quanto você pode faturar por ano e o que acontece se ultrapassar.",tag:"Importante",conteudo:<>MEI pode faturar até <strong>R$ 81.000/ano</strong>.<br/><br/>Ultrapassar até 20% → vira ME. Ultrapassar mais → perda retroativa dos benefícios.<br/><br/>⚠️ Seu faturamento está em <strong>84%</strong> do limite.</>},
  {emoji:"📄",titulo:"Nota Fiscal do MEI",      desc:"Quando emitir, como emitir e diferença entre NF de serviço e produto.",tag:"Prática",   conteudo:<><strong>NFS-e:</strong> prefeitura, para serviços a PJ.<br/><strong>NF Produto:</strong> SEFAZ, para venda a empresas.<br/><br/>Para pessoas físicas não é obrigatória, mas é recomendada.</>},
  {emoji:"🔄",titulo:"IBS e CBS — Reforma",     desc:"O que muda com a reforma tributária e como o MEI é afetado.",tag:"Novo",       conteudo:<><strong>CBS</strong> substitui PIS/COFINS. <strong>IBS</strong> substitui ICMS/ISS.<br/><br/>O MEI está protegido por regras específicas. Transição: 2026–2032.</>},
  {emoji:"🛡️",titulo:"Benefícios do MEI",      desc:"Aposentadoria, auxílio-doença, salário-maternidade e outros direitos.",tag:"Direitos", conteudo:<>Pagando DAS em dia você tem:<br/><br/>✅ Aposentadoria por idade · ✅ Auxílio-doença (12 meses) · ✅ Salário-maternidade (10 meses) · ✅ Pensão por morte</>},
  {emoji: "", titulo:"Seguros para MEI's", desc:"", tag:"Seguros", conteudo:<></>}
];

const CONTATOS = [
  {id:1,init:"C", nome:"Contador Silva", status:"Online agora",      preview:"Enviei o boleto do DAS",      time:"10:42",unread:true},
  {id:2,init:"🤖",nome:"Assistente IA",  status:"Sempre disponível", preview:"Posso te ajudar com dúvidas", time:"09:15",unread:true},
];
const MSGS_INIT = {
  1:[{de:"theirs",texto:"Olá! Enviei o boleto do DAS de maio para você.",hora:"10:30"},{de:"theirs",texto:"Lembre-se que vence no dia 20!",hora:"10:31"},{de:"mine",texto:"Obrigada! Vou pagar ainda hoje.",hora:"10:42"}],
  2:[{de:"theirs",texto:"Olá! Sou o assistente IA. Como posso ajudar?",hora:"09:00"},{de:"mine",texto:"Qual o prazo da DASN?",hora:"09:10"},{de:"theirs",texto:"A DASN-SIMEI deve ser entregue até 31 de maio. Está em dia! ✅",hora:"09:15"}],
};

const MESES = [{nome:"Jan",valor:5200},{nome:"Fev",valor:4800},{nome:"Mar",valor:6100},{nome:"Abr",valor:7400},{nome:"Mai",valor:6300},{nome:"Jun",valor:8200},{nome:"Jul",valor:7100},{nome:"Ago",valor:5900},{nome:"Set",valor:4700},{nome:"Out",valor:5800},{nome:"Nov",valor:3900},{nome:"Dez",valor:3000}];
const FAT_TOTAL=68400,FAT_LIMITE=81000,FAT_PCT=Math.round(FAT_TOTAL/FAT_LIMITE*100),MAIOR_MES=Math.max(...MESES.map(m=>m.valor));

const DOCS = [
  {icon:"📄",nome:"DAS_maio_2025.pdf",   meta:"Enviado há 3 dias · 42 KB",     tag:"fiscal",   tagLabel:"Fiscal"},
  {icon:"📊",nome:"Faturamento_Q1.pdf",  meta:"Enviado há 1 semana · 128 KB",  tag:"ok",       tagLabel:"Aprovado"},
  {icon:"📋",nome:"DASN_2023.pdf",       meta:"Enviado há 2 meses · 88 KB",    tag:"ok",       tagLabel:"Aprovado"},
  {icon:"🧾",nome:"NF_servico_abr.pdf",  meta:"Aguardando revisão · 56 KB",    tag:"pendente", tagLabel:"Pendente"},
  {icon:"📄",nome:"Contrato_MEI.pdf",    meta:"Aguardando revisão · 210 KB",   tag:"pendente", tagLabel:"Pendente"},
  {icon:"📊",nome:"Relatorio_anual.pdf", meta:"Enviado há 3 meses · 340 KB",   tag:"ok",       tagLabel:"Aprovado"},
  {icon:"🧾",nome:"NF_produto_mar.pdf",  meta:"Enviado há 1 mês · 64 KB",      tag:"fiscal",   tagLabel:"Fiscal"},
];

const NAV = [
  {id:"dashboard",   icon:"🏠",label:"Início",      badge:0},
  {id:"faturamento", icon:"📈",label:"Faturamento", badge:0},
  {id:"alertas",     icon:"🔔",label:"Alertas",     badge:0},
  {id:"aprendizado", icon:"📚",label:"Aprendizado", badge:0},
  {id:"documentos",  icon:"📁",label:"Documentos",  badge:0},
];

/* ══════════════ HOOKS ══════════════ */
  function useTypewriter(text, speed = 28) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);

    return () => {
      clearInterval(id);
      setDisplay(""); // reset acontece no cleanup, não na inicialização
    };
  }, [text, speed]);

  return display;
}

function useVis(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return visible;
}
/* ══════════════ CHARTS ══════════════ */
function LineChart(){
  const r=useRef(null),inst=useRef(null);
  useEffect(()=>{
    if(!r.current)return; inst.current?.destroy();
    const ctx=r.current.getContext("2d"),g=ctx.createLinearGradient(0,0,0,220);
    g.addColorStop(0,"rgba(99,102,241,.28)");g.addColorStop(1,"rgba(99,102,241,0)");
    inst.current=new Chart(r.current,{type:"line",data:{labels:MONTHS,datasets:[{data:REVENUE,borderColor:"rgba(143, 29, 63, 0.35)",backgroundColor:"rgba(143, 29, 63, 0.20)",borderWidth:2.5,tension:.45,fill:true,pointBackgroundColor:"rgba(143, 29, 63, 0.40)",pointBorderColor:"rgba(143, 29, 63, 0.35)",pointBorderWidth:2,pointRadius:5,pointHoverRadius:8,pointHoverBackgroundColor:"#fff"}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:1600,easing:"easeInOutQuart",delay:(c)=>c.dataIndex*70},interaction:{mode:"index",intersect:false},scales:{x:{grid:{color:"rgba(255,255,255,.04)"},ticks:{color:"rgba(240,240,255,.3)",font:{family:"DM Sans",size:11}}},y:{grid:{color:"rgba(255,255,255,.04)"},ticks:{color:"rgba(240,240,255,.3)",font:{family:"DM Sans",size:11},callback:(v)=>`R$${(v/1000).toFixed(0)}k`}}},plugins:{legend:{display:false},tooltip:{backgroundColor:"rgba(12,12,22,.95)",titleColor:"#f0f0ff",bodyColor:"rgba(240,240,255,.55)",borderColor:"rgba(99,102,241,.3)",borderWidth:1,padding:12,callbacks:{label:(c)=>` R$ ${c.parsed.y.toLocaleString("pt-BR")}`}}}}});
    return()=>inst.current?.destroy();
  },[]);
  return <canvas ref={r}/>;
}

function DonutChart(){
  const r=useRef(null),inst=useRef(null);
  useEffect(()=>{
    if(!r.current)return; inst.current?.destroy();
    inst.current=new Chart(r.current,{type:"doughnut",data:{labels:PIE_DATA.map(d=>d.label),datasets:[{data:PIE_DATA.map(d=>d.value),backgroundColor:PIE_DATA.map(d=>d.color+"bb"),borderColor:PIE_DATA.map(d=>d.color),borderWidth:2,hoverOffset:12}]},options:{responsive:true,maintainAspectRatio:false,cutout:"70%",animation:{animateRotate:true,animateScale:false,duration:1800,easing:"easeInOutQuart"},plugins:{legend:{display:false},tooltip:{backgroundColor:"rgba(12,12,22,.95)",titleColor:"#f0f0ff",bodyColor:"rgba(240,240,255,.55)",borderColor:"rgba(99,102,241,.3)",borderWidth:1,padding:10,callbacks:{label:(c)=>` ${c.parsed.toFixed(1)}%`}}}}});
    return()=>inst.current?.destroy();
  },[]);
  return(<div><div className="donut-canvas-wrap"><canvas ref={r}/><div className="donut-center"><div className="donut-center-val">85%</div><div className="donut-center-sub">Meta</div></div></div><div className="pie-legend">{PIE_DATA.map(d=><div className="pie-row" key={d.label}><div className="pie-dot" style={{background:d.color}}/>{d.label}<span className="pie-val">{d.value}%</span></div>)}</div></div>);
}

/* ══════════════ PAGES ══════════════ */
function Dashboard({navigate}){
  const user = getUserFromToken();
  const nome = user?.nome || "Usuário";
  const sRef=useRef(null),cRef=useRef(null),bRef=useRef(null);
  const sVis=useVis(sRef),cVis=useVis(cRef),bVis=useVis(bRef);
  const [barAnim,setBarAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setBarAnim(true),500);return()=>clearTimeout(t);},[]);
  const STATS=[
    {icon:"💰",cls:"si-0",label:"Receita Mensal", value:"R$ 6.800",sub:<><span className="tok">▲ 6,5%</span> vs. mês anterior</>,  bar:"84%",barColor:"#f59e0b"},
    {icon:"📦",cls:"si-1",label:"Pedidos Ativos",  value:"142",      sub:<><span className="tok">✓ 97%</span> processados</>,         bar:"97%",barColor:"#22c55e"},
    {icon:"🔴",cls:"si-2",label:"Inadimplência",   value:"R$ 1.240", sub:<><span className="twarn">▲ 2%</span> vs. mês anterior</>,  bar:"18%",barColor:"#ef4444"},
    {icon:"⭐",cls:"si-3",label:"NPS Score",        value:"87",       sub:<><span className="tok">▲ 3pts</span> — Excelente</>,       bar:"87%",barColor:"#8f1d3f"},
  ];
  return(<>
    <div className="page-eyebrow">Visão geral · Abril 2026</div>
    <h1 className="page-h1">Bom dia, <em>{nome}</em> 👋</h1>
    <div className="alert-banner">
      <span>⚠️</span>
      <div><strong>Atenção:</strong> 2 faturas vencem nos próximos 3 dias. Total: <strong>R$ 4.820</strong></div>
      <button className="alert-action" onClick={()=>navigate("alertas")}>Ver alertas</button>
    </div>
    <div className="stats-grid" ref={sRef}>
      {STATS.map((s,i)=>(
        <div key={i} className={`stat-card${sVis?" vis":""}`}>
          <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className="bar-wrap"><div className="bar-fill" style={{width:barAnim?s.bar:"0%",background:s.barColor}}/></div>
          <div className="stat-sub">{s.sub}</div>
        </div>
      ))}
    </div>
    <div className={`chart-panel${cVis?" vis":""}`} ref={cRef}>
      <div className="panel-header">
        <div className="panel-title">Receita Mensal (R$) — por categoria</div>
        <div className="panel-badge">▲ 6,5% este mês</div>
      </div>
      <div className="charts-inner">
        <div className="line-wrap"><LineChart/></div>
        <DonutChart/>
      </div>
    </div>
    <div className="bottom-grid" ref={bRef}>
      <div className={`info-card${bVis?" vis":""}`}>
        <div className="card-hdr"><div className="card-title">Alertas</div><button className="card-link" onClick={()=>navigate("alertas")}>Ver todos →</button></div>
        <div className="mini-alert-list">
          {ALERTAS.slice(0,3).map((a,i)=>(
            <div key={i} className={`mini-alert ${a.tipo==="danger"||a.tipo==="warn"?"warn":"ok"}${bVis?" vis":""}`}>
              <span>{a.emoji}</span>
              <div><div style={{fontWeight:500,fontSize:"12.5px"}}>{a.titulo}</div><div style={{fontSize:"11.5px",opacity:.7,marginTop:2}}>{a.data}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className={`info-card${bVis?" vis":""}`}>
        <div className="card-hdr"><div className="card-title">CHAT DESATIVADO</div></div>
        <div className="mini-chat-list"></div>
      </div>
      <div className={`info-card${bVis?" vis":""}`}>
        <div className="card-hdr"><div className="card-title">IA DESATIVADA</div></div>
      </div>
    </div>
  </>);
}

function Alertas(){
  const ativos=ALERTAS.filter(a=>a.tipo==="danger"||a.tipo==="warn");
  const resolvidos=ALERTAS.filter(a=>a.tipo==="ok"||a.tipo==="info");
  return(<>
    <div className="page-eyebrow">Notificações</div>
    <h1 className="page-h1">Seus <em>alertas</em></h1>
    <div className="a-section-label">Atenção necessária ({ativos.length})</div>
    <div className="a-list">{ativos.map((a,i)=><div key={i} className={`a-card ${a.tipo} vis`} style={{animationDelay:`${i*.1}s`}}><span className="a-emoji">{a.emoji}</span><div><div className="a-title">{a.titulo}</div><div className="a-desc">{a.desc}</div><div className="a-date">{a.data}</div></div></div>)}</div>
    <div className="a-section-label">Resolvidos e informativos ({resolvidos.length})</div>
    <div className="a-list">{resolvidos.map((a,i)=><div key={i} className={`a-card ${a.tipo} vis`} style={{animationDelay:`${(i+ativos.length)*.1}s`}}><span className="a-emoji">{a.emoji}</span><div><div className="a-title">{a.titulo}</div><div className="a-desc">{a.desc}</div><div className="a-date">{a.data}</div></div></div>)}</div>
  </>);
}

function Aprendizado(){
  const [aberto,setAberto]=useState(null);
  return(<>
    <div className="page-eyebrow">Conteúdo</div>
    <h1 className="page-h1">Módulo de <em>aprendizado</em></h1>
    <div className="edu-grid">
      {CONTEUDOS.map((c,i)=>(
        <div key={i} className={`edu-card vis${aberto===i?" open":""}`} style={{animationDelay:`${i*.07}s`}} onClick={()=>setAberto(aberto===i?null:i)}>
          <div className="edu-emoji">{c.emoji}</div>
          <div className="edu-titulo">{c.titulo}</div>
          <div className="edu-desc">{c.desc}</div>
          <span className="edu-tag">{c.tag}</span>
          {aberto===i&&<div className="edu-content">{c.conteudo}</div>}
        </div>
      ))}
    </div>
  </>);
}

function Faturamento(){
  const ref=useRef(null);const vis=useVis(ref,.05);
  const [barAnim,setBarAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setBarAnim(true),300);return()=>clearTimeout(t);},[]);
  return(<>
    <div className="page-eyebrow">Financeiro</div>
    <h1 className="page-h1">Dashboard de <em>faturamento</em></h1>
    <div className="fat-cards" ref={ref}>
      {[
        {label:"Faturamento acumulado",value:"R$ 68.400",sub:<><span className="twarn">{FAT_PCT}% do limite anual</span></>},
        {label:"Limite MEI 2024",       value:"R$ 81.000",sub:<>Restam <span className="tok">R$ 12.600</span></>},
        {label:"Melhor mês",            value:"R$ 8.200", sub:"Junho/2024"},
      ].map((c,i)=><div key={i} className={`fat-card${vis?" vis":""}`} style={{animationDelay:`${i*.1}s`}}><div className="fat-card-label">{c.label}</div><div className="fat-card-value">{c.value}</div><div className="fat-card-sub">{c.sub}</div></div>)}
    </div>
    <div className="big-bar-box">
      <div className="big-bar-label"><span>Progresso do limite anual</span><span className="twarn">{FAT_PCT}%</span></div>
      <div className="big-bar-track"><div className="big-bar-fill" style={{width:barAnim?`${FAT_PCT}%`:"0%",background:FAT_PCT>85?"#ef4444":"#8f1d3f"}}/></div>
      <div className="big-bar-info"><span>R$ 0</span><span>⚠️ Zona de atenção a partir de 80%</span><span>R$ 81.000</span></div>
    </div>
    <div className="page-eyebrow" style={{marginBottom:14}}>Faturamento por mês</div>
    <div className="meses-grid">
      {MESES.map((m,i)=>(
        <div key={i} className={`mes-card${vis?" vis":""}`} style={{animationDelay:`${.3+i*.04}s`}}>
          <div className="mes-nome">{m.nome}</div>
          <div className="mes-valor" style={{color:m.valor<4500?"rgba(240,240,255,.4)":undefined}}>R$ {(m.valor/1000).toFixed(1)}k</div>
          <div className="mes-bar"><div className="mes-bar-fill" style={{width:barAnim?`${(m.valor/MAIOR_MES)*100}%`:"0%",background:m.valor<4500?"#f59e0b":"#8f1d3f",transition:"width 1.2s cubic-bezier(.22,1,.36,1)"}}/></div>
        </div>
      ))}
    </div>
  </>);
}

function Documentos(){
  const [toast,setToast]=useState(false);
  const ref=useRef(null);const vis=useVis(ref,.05);
  const simular=()=>{setToast(true);setTimeout(()=>setToast(false),3000);};
  return(<>
    <div className="page-eyebrow">Gestão</div>
    <h1 className="page-h1">Seus <em>documentos</em></h1>
    <div className="upload-area" onClick={simular}>
      <div className="upload-icon">📤</div>
      <div className="upload-title">Enviar novo documento</div>
      <div className="upload-sub">PDF, imagem ou planilha · Máx. 10MB</div>
      <button className="upload-btn">Selecionar arquivo</button>
    </div>
    <div className="page-eyebrow" style={{marginBottom:14}}>Todos os documentos ({DOCS.length})</div>
    <div className="docs-grid" ref={ref}>
      {DOCS.map((d,i)=><div key={i} className={`doc-card${vis?" vis":""}`} style={{animationDelay:`${i*.06}s`}}><div className="doc-icon-big">{d.icon}</div><div className="doc-name">{d.nome}</div><div className="doc-meta">{d.meta}</div><span className={`doc-tag ${d.tag}`}>{d.tagLabel}</span></div>)}
    </div>
    {toast&&<div className="toast">✓ Documento enviado com sucesso!</div>}
  </>);
}

/* ══════════════ APP SHELL ══════════════ */
export default function App({ onLogout, onNavegar }){
  const [view,setView]=useState("dashboard"),[key,setKey]=useState(0);
  const navigate=(id)=>{setView(id);setKey(k=>k+1);window.scrollTo({top:0,behavior:"smooth"});};

  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUserFromToken();
  const usuarioNome = user?.nome || "Usuário";
  const usuarioEmail = user?.email || "E-mail";

  const PAGES={
    dashboard:   <Dashboard navigate={navigate}/>,
    faturamento: <Faturamento/>,
    alertas:     <Alertas/>,
    aprendizado: <Aprendizado/>,
    documentos:  <Documentos/>,
  };

  return(<>
    <div className="shell">
      <header className="hdr">
        <div className="hdr-logo">bridge<span>.</span>mei</div>
        <nav className="hdr-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`npill${view===n.id?" active":""}`} onClick={()=>navigate(n.id)}>
              <span>{n.icon}</span>{n.label}
              {n.badge>0&&<span className="npill-badge">{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="hdr-right">
          <div className="user-menu-wrapper">
          <div className="hdr-avatar" onClick={() => setMenuOpen(!menuOpen)}>
            {usuarioNome.charAt(0).toUpperCase()}
          </div>
          {menuOpen && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-avatar-big">
                  {usuarioNome.charAt(0).toUpperCase()}
                </div>
                <div className="user-name">
                  {usuarioNome}
                </div>
                <div className="user-email">
                  {usuarioEmail}
                </div>
              </div>

              <div className="user-menu-divider" />
                <button className="user-menu-item" onClick={() => onNavegar("estoque")}>
                 📦 Estoque
                </button>
                <button className="user-menu-item danger" onClick={onLogout}>
                  ⎋ Sair
                </button>
            </div>
            )}
          </div>
        </div>
      </header>
      <div key={key} className="page-wrap" style={view==="mensagens"?{paddingTop:0}:{paddingTop:4}}>
        {PAGES[view]}
      </div>
    </div>
  </>);
}