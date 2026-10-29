import { useState, useEffect, useMemo, useRef } from "react";
import { getUserFromToken } from "./utils/auth";
import {
  Chart, ArcElement, DoughnutController, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";
import "./styles/Mei.css";
import Vendas from "./Vendas";
import useVendas from "./hooks/useVendas.js";
import { calcularMetricasVendas } from "./utils/metricasVendas.js";
import {fetchEstoqueWithAuth} from "./services/api.js"

Chart.register(
  ArcElement, DoughnutController, LineController, LineElement,
  PointElement, LinearScale, CategoryScale, Filler, Tooltip
);

/* 
══════════════ 
DATA
══════════════ 
*/

const PIE_DATA = [
  { label: "Serviços", value: 58, color: "--color-accent" },
  { label: "Produtos", value: 27, color: "--color-success" },
  { label: "Outros", value: 15, color: "--color-warning" }
];
/*
const MONTHS    = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago"];
const REVENUE   = [4200,5100,6300,7200,6100,5900,6200,6800];*/

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
  {emoji:"🛡️",titulo:"Benefícios do MEI",      desc:"Aposentadoria, auxílio-doença, salário-maternidade e outros direitos.",tag:"Direitos", conteudo:<>Pagando DAS em dia você tem:<br/><br/>✅ Aposentadoria por idade · ✅ Auxílio-doença (12 meses) · ✅ Salário-maternidade (10 meses) · ✅ Pensão por morte</>}, {emoji:"🛡️",title:"", desc:"",tag:"", content:<></>},
  {emoji:"🏦",title:"",desc: "",tag:"",content:<></>},
];

/*
const MESES = [{nome:"Jan",valor:5200},{nome:"Fev",valor:4800},{nome:"Mar",valor:6100},{nome:"Abr",valor:7400},{nome:"Mai",valor:6300},{nome:"Jun",valor:8200},{nome:"Jul",valor:7100},{nome:"Ago",valor:5900},{nome:"Set",valor:4700},{nome:"Out",valor:5800},{nome:"Nov",valor:3900},{nome:"Dez",valor:3000}];
const FAT_TOTAL=68400,FAT_LIMITE=81000,FAT_PCT=Math.round(FAT_TOTAL/FAT_LIMITE*100),MAIOR_MES=Math.max(...MESES.map(m=>m.valor));
*/

const NAV = [
  {id:"dashboard",   icon:"🏠",key:"nav.inicio",      badge:0},
  {id:"faturamento", icon:"📈",key:"nav.faturamento", badge:0},
  {id: "vendas", icon: "🛒", key: "nav.vendas", badge: 0},
  {id:"aprendizado", icon:"📚",key:"nav.aprendizado", badge:0},
];

/* 
══════════════ 
HOOKS 
══════════════ 
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
*/
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

function getThemeColor(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

/* 
══════════════ 
CHARTS 
══════════════ 
*/
function LineChart({meses, idioma}){
  const r = useRef(null);
  const inst = useRef(null);
  useEffect(() => {
    if (!r.current) return;

    inst.current?.destroy();

    const accent = getThemeColor("--color-accent");
    const accentGlow = getThemeColor("--color-accent-glow");
    const border = getThemeColor("--color-border");
    const textMuted = getThemeColor("--color-text-muted");
    const text = getThemeColor("--color-text");
    const surface = getThemeColor("--color-bg-secondary");

    inst.current = new Chart(r.current, {
      type: "line",

      data: {
        labels: meses.map(({ mes }) => new Intl.DateTimeFormat(idioma, { month: "short" })
        .format(new Date(new Date().getFullYear(), mes, 1))),

        datasets: [{
          data: meses.map(({ total }) => total),
          borderColor: accent,
          backgroundColor: accentGlow,
          borderWidth: 2.5,
          tension: .45,
          fill: true,
          pointBackgroundColor: accent,
          pointBorderColor: accent,
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: text
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          duration: 1600,
          easing: "easeInOutQuart",
          delay: (c) => c.dataIndex * 70
        },
        
        interaction: {
          mode: "index",
          intersect: false
        },
        
        scales: {
          x: {
            grid: {
              color: border
            },
            
            ticks: {
              color: textMuted,
              font: {
                family: "DM Sans",
                size: 11
              }
            }
          },

          y: {
            grid: {
              color: border
            },
            
            ticks: {
              color: textMuted,
              font: {
                family: "DM Sans",
                size: 11
              },

              callback: (v) => `R$${(v / 1000).toFixed(0)}k`
            }
          }
        },

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            backgroundColor: surface,
            titleColor: text,
            bodyColor: textMuted,
            borderColor: accent,
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (c) =>
                ` R$ ${c.parsed.y.toLocaleString("pt-BR")} `
            }
          }
        }
      }
    });

    return () => inst.current?.destroy();
  }, [meses, idioma]);

  return <canvas ref={r}/>;
}

function DonutChart(){
  const r = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!r.current) return;

    inst.current?.destroy();

    const colors = PIE_DATA.map(d => getThemeColor(d.color));

    const text = getThemeColor("--color-text");
    const textMuted = getThemeColor("--color-text-muted");
    const surface = getThemeColor("--color-bg-secondary");
    const accent = getThemeColor("--color-accent");

    inst.current = new Chart(r.current, {
      type: "doughnut",

      data: {
        labels: PIE_DATA.map(d => d.label),
        
        datasets: [{
          data: PIE_DATA.map(d => d.value),
          backgroundColor: colors.map(color => color + "bb"),
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 12
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        
        animation: {
          animateRotate: true,
          animateScale: false,
          duration: 1800,
          easing: "easeInOutQuart"
        },
        
        plugins: {
          legend: {
            display: false
          },
          
          tooltip: {
            backgroundColor: surface,
            titleColor: text,
            bodyColor: textMuted,
            borderColor: accent,
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (c) => ` ${c.parsed.toFixed(1)}%`
            }
          }
        }
      }
    });

    return () => inst.current?.destroy();
  }, []);
  return (
    <div>
      <div className="donut-canvas-wrap">
        <canvas ref={r}/>

        <div className="donut-center">
          <div className="donut-center-val">85%</div>
          <div className="donut-center-sub">Meta</div>
        </div>
      </div>

      <div className="pie-legend">
        {PIE_DATA.map((d, i) => (
          <div className="pie-row" key={d.label}>
            <div
              className="pie-dot"
              style={{ background: getThemeColor(d.color) }}
            />

            {d.label}

            <span className="pie-val">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 
══════════════ 
PAGES 
══════════════ 

══════════════ 
DASHBOARD
══════════════ 
*/

function Dashboard({ navigate }) {
  const user = getUserFromToken();
  const nome = user?.nome || "Usuário";
  const sRef = useRef(null);
  const cRef = useRef(null);
  const bRef = useRef(null);

  const sVis = useVis(sRef);
  const cVis = useVis(cRef);
  const bVis = useVis(bRef);

  const [barAnim, setBarAnim] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [erroEstoque, setErroEstoque] = useState(false);

  const { t, i18n } = useTranslation();
  const { vendas, carregando, erro } = useVendas();

  const metricas = useMemo(
    () => calcularMetricasVendas(vendas),
    [vendas]
  );

  const idioma =
    i18n.language === "en-US" ? "en-US" : "pt-BR";

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat(idioma, {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  // Carrega os produtos para calcular os alertas de estoque.
  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        const resposta = await fetchEstoqueWithAuth("/api/Produtos");

        if (!resposta.ok) {
          throw new Error("Falha ao carregar estoque");
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
          throw new Error("Resposta inválida da API");
        }

        const normalizados = dados.map((p) => ({
          id: p.Id ?? p.id,
          nome: p.Nome ?? p.nome,
          quantidade: Number(
            p.Quantidade ?? p.quantidade ?? 0
          ),
        }));

        if (ativo) {
          setProdutos(normalizados);
          setErroEstoque(false);
        }
      } catch {
        if (ativo) {
          setErroEstoque(true);
        }
      }
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBarAnim(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mesma regra de estoque usada em Estoque.jsx.
  const estoqueZerado = produtos.filter(
    (p) => p.quantidade === 0
  ).length;

  const estoqueBaixo = produtos.filter(
    (p) => p.quantidade > 0 && p.quantidade <= 5
  ).length;

  const produtosAtencao = estoqueZerado + estoqueBaixo;

  const ticketMedioMensal =
    metricas.quantidadeVendasMensal > 0
      ? metricas.faturamentoMensal /
        metricas.quantidadeVendasMensal
      : 0;

  // Percentuais usados nas barras visuais.
  const percentualAnual = Math.min(
    100,
    (metricas.faturamentoAnual / 81000) * 100
  );

  const percentualVendas =
    metricas.quantidadeVendas > 0
      ? Math.min(
          100,
          (metricas.quantidadeVendasMensal /
            metricas.quantidadeVendas) *
            100
        )
      : 0;

  const percentualEstoque =
    produtos.length > 0
      ? (produtosAtencao / produtos.length) * 100
      : 0;

  const percentualTicket =
    metricas.faturamentoMensal > 0
      ? (ticketMedioMensal /
          metricas.faturamentoMensal) *
        100
      : 0;

  const STATS = [
    {icon: "💰", cls: "si-0", key: "dash-stats.monthRevenue",
      value: formatarMoeda(metricas.faturamentoMensal),
      sub: t("dash-stats.currentMonth"),
      bar: `${percentualAnual}%`, barColor: "var(--color-warning)",},

    {icon: "🛒", cls: "si-1", key: "dash-stats.monthSales",
      value: metricas.quantidadeVendasMensal,
      sub: t("dash-stats.salesRegistered"),
      bar: `${percentualVendas}%`, barColor: "var(--color-success)",},

    {icon: "📦", cls: "si-2", key: "dash-stats.stockAttention",
      value: erroEstoque ? "—" : produtosAtencao,
      sub: erroEstoque ? t("dash-stats.stockUnavailable") : t("dash-stats.stockBreakdown", 
        {
          low: estoqueBaixo,
          out: estoqueZerado,
        }),
      bar: `${percentualEstoque}%`, barColor: "var(--color-danger)",},
      
    {icon: "🧾", cls: "si-3", key: "dash-stats.monthTicket",
      value: formatarMoeda(ticketMedioMensal),
      sub: t("dash-stats.averagePerSale"),
      bar: `${percentualTicket}%`, barColor: "var(--color-accent)",},
  ];

  return (
    <>
      <div className="page-eyebrow">
        {t("dashboard.overview")}
      </div>

      <h1 className="page-h1">
        {t("dashboard.greetings")} <em>{nome}</em>
      </h1>

      {(carregando || erro) && (
        <p className="fat-card-sub" role={erro ? "alert" : undefined}>
          {carregando
            ? t("dash-stats.loadingSales")
            : `${t("dash-stats.salesUnavailable")} ${erro}`}
        </p>
      )}

      <div className="stats-grid" ref={sRef}>
        {STATS.map((s, i) => (
          <div
            key={s.key}
            className={`stat-card${sVis ? " vis" : ""}`}
          >
            <div className={`stat-icon ${s.cls}`}>
              {s.icon}
            </div>

            <div className="stat-label">
              {t(s.key)}
            </div>

            <div className="stat-value">
              {s.value}
            </div>

            <div className="bar-wrap">
              <div
                className="bar-fill"
                style={{
                  width: barAnim ? s.bar : "0%",
                  background: s.barColor,
                }}
              />
            </div>

            <div className="stat-sub">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`chart-panel${cVis ? " vis" : ""}`}
        ref={cRef}
      >
        <div className="panel-header">
          <div className="panel-title">
            {t("dashboard.revenueCategory")}
          </div>

          <div className="panel-badge">
            {t("dashboard.thisMonth")}
          </div>
        </div>

        <div className="charts-inner">
          <div className="line-wrap">
            <LineChart
              meses={metricas.meses}
              idioma={idioma}
            />
          </div>

          <DonutChart />
        </div>
      </div>

      <div className="bottom-grid" ref={bRef}>
        <div className={`info-card${bVis ? " vis" : ""}`}>
          <div className="card-hdr">
            <div className="card-title">
              {t("dashboard.alertsCard")}
            </div>

            <button className="card-link">
              {t("dashboard.viewAll")} →
            </button>
          </div>

          <div className="mini-alert-list">
            {ALERTAS.slice(0, 3).map((a, i) => (
              <div
                key={i}
                className={`mini-alert ${
                  a.tipo === "danger" || a.tipo === "warn"
                    ? "warn"
                    : "ok"
                }${bVis ? " vis" : ""}`}
              >
                <span>{a.emoji}</span>

                <div>
                  <div style={{ fontWeight: 500, fontSize: "12.5px" }}>
                    {a.titulo}
                  </div>

                  <div
                    style={{
                      fontSize: "11.5px",
                      opacity: 0.7,
                      marginTop: 2,
                    }}
                  >
                    {a.data}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`info-card${bVis ? " vis" : ""}`}>
          <div className="card-hdr">
            <div className="card-title">
              {t("dashboard.chatDisabled")}
            </div>
          </div>

          <div className="mini-chat-list" />
        </div>

        <div className={`info-card${bVis ? " vis" : ""}`}>
          <div className="card-hdr">
            <div className="card-title">
              {t("dashboard.aiDisabled")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* 
══════════════ 
APRENDIZADO 
══════════════ 
*/
function Aprendizado(){
  const [aberto,setAberto]=useState(null);
  const { t } = useTranslation();
  return(<>
    <div className="page-eyebrow">{t("learning.heading")}</div>
    <h1 className="page-h1">{t("learning.titleBefore")} <em>{t("learning.titleEm")}</em> {t("learning.titleAfter")}</h1>
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
/* 
══════════════ 
FATURAMENTO 
══════════════ 
*/
function Faturamento(){
  const ref=useRef(null);const vis=useVis(ref,.05);
  const [barAnim,setBarAnim]=useState(false);
  
  useEffect(()=>{const t=setTimeout(()=>setBarAnim(true),300);
    return()=>clearTimeout(t);
  },[]);

 
  const { t, i18n } = useTranslation();
  const { vendas, carregando, erro } = useVendas();

  const metricas = useMemo(
    () => calcularMetricasVendas(vendas),
    [vendas]
  );

  const LIMITE_MEI_ANUAL = 81000;
  const anoAtual = new Date().getFullYear();

  const percentual = Math.min(
    (metricas.faturamentoAnual / LIMITE_MEI_ANUAL) * 100,
    100
  );

  const restante = Math.max(
    LIMITE_MEI_ANUAL - metricas.faturamentoAnual,
    0
  );

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat(
      i18n.language === "en-US" ? "en-US" : "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    ).format(valor);

  const nomeMes = (mes) =>
    new Intl.DateTimeFormat(
      i18n.language === "en-US" ? "en-US" : "pt-BR",
      { month: "long" }
    ).format(new Date(anoAtual, mes, 1));

  const melhorMes = metricas.melhorMes;

  const maiorValorMensal = Math.max(
    ...metricas.meses.map((mes) => mes.total),
    0
  );
  return (
    <>
      <div className="page-eyebrow">{t("revenue.heading")}</div>

      <h1 className="page-h1">
        {t("revenue.titleBefore")}<em>{t("revenue.title-em")}</em>{t("revenue.titleAfter")}
      </h1>

      {carregando && (
        <p className="fat-card-sub">{t("renevue.loadingData")}</p>
      )}

      {erro && (
        <p className="fat-card-sub" role="alert">
          {t("revenue.loadingError")} {erro}
        </p>
      )}

      <div className="fat-cards" ref={ref}>
        {[
          {
            label: t("revenue.accumulated"),
            value: formatarMoeda(metricas.faturamentoAnual),
            sub: (
              <span className="twarn">
                {percentual.toFixed(1)}% {t("revenue.annual-percent")}
              </span>
            ),
          },
          {
            label: t("revenue.meiLimit"),
            value: formatarMoeda(LIMITE_MEI_ANUAL),
            sub: (
              <>
                {t("revenue.remaining")}{" "}
                <span className="tok">{formatarMoeda(restante)}</span>
              </>
            ),
          },
          {
            label: t("revenue.bestMonth"),
            value: melhorMes
              ? formatarMoeda(melhorMes.total)
              : formatarMoeda(0),
            sub: melhorMes
              ? `${nomeMes(melhorMes.mes)} / ${anoAtual}`
              : "Nenhuma venda neste ano",
          },
        ].map((c, i) => (
          <div
            key={i}
            className={`fat-card${vis ? " vis" : ""}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="fat-card-label">{c.label}</div>
            <div className="fat-card-value">{c.value}</div>
            <div className="fat-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="big-bar-box">
        <div className="big-bar-label">
          <span>{t("revenue.progress")}</span>
          <span className="twarn">{percentual.toFixed(1)}%</span>
        </div>

        <div className="big-bar-track">
          <div
            className="big-bar-fill"
            style={{
              width: barAnim ? `${percentual}%` : "0%",
              background:
                percentual >= 85
                  ? "var(--color-danger)"
                  : "var(--color-accent)",
            }}
          />
        </div>

        <div className="big-bar-info">
          <span>{formatarMoeda(0)}</span>
          <span>⚠️ {t("revenue.attentionZone")}</span>
          <span>{formatarMoeda(LIMITE_MEI_ANUAL)}</span>
        </div>
      </div>

      <div className="page-eyebrow" style={{ marginBottom: 14 }}>
        {t("revenue.byMonth")}
      </div>

      <div className="meses-grid">
        {metricas.meses.map((m) => {
          const percentualMes =
            maiorValorMensal > 0
              ? (m.total / maiorValorMensal) * 100
              : 0;

          return (
            <div
              key={m.mes}
              className={`mes-card${vis ? " vis" : ""}`}
              style={{
                animationDelay: `${0.3 + m.mes * 0.04}s`,
              }}
            >
              <div className="mes-nome">{nomeMes(m.mes)}</div>

              <div
                className="mes-valor"
                style={{
                  color:
                    m.total < 4500
                      ? "var(--color-text)"
                      : undefined,
                }}
              >
                {formatarMoeda(m.total)}
              </div>

              <div className="mes-bar">
                <div
                  className="mes-bar-fill"
                  style={{
                    width: barAnim ? `${percentualMes}%` : "0%",
                    background:
                      m.total < 4500
                        ? "var(--color-warning)"
                        : "var(--color-accent)",
                    transition:
                      "width 1.2s cubic-bezier(.22,1,.36,1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* 
══════════════ 
APP SHELL 
══════════════ 
*/
export default function App({ onLogout, onNavegar }){
  const [view,setView]=useState("dashboard"),[key,setKey]=useState(0);
  const navigate=(id)=>{setView(id);setKey(k=>k+1);window.scrollTo({top:0,behavior:"smooth"});};
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => { i18n.changeLanguage(language); localStorage.setItem("language", language); }
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUserFromToken();
  const usuarioNome = user?.nome || "Usuário";
  const usuarioEmail = user?.email || "E-mail";

  const PAGES={
    dashboard:   <Dashboard navigate={navigate}/>,
    faturamento: <Faturamento/>,
    vendas: <Vendas/>,
    aprendizado: <Aprendizado/>,
  };

  return(<>
    <div className="shell">
      <header className="hdr">
        <div className="hdr-logo">bridge<span>.</span>mei</div>
        <nav className="hdr-nav">
          {NAV.map(n =>(
            <button key={n.id} className={`npill${view===n.id?" active":""}`} onClick={()=>navigate(n.id)}>
              <span>{n.icon}</span>
              {n.badge>0&&<span className="npill-badge">{n.badge}</span>}
              {t(n.key)}
            </button>
          ))}
        </nav>
        <div className="hdr-right">
          {/* idioma*/}
          <div className="lang-switcher">
            <button className={i18n.language === "pt-BR" ? "language-btn active" : "language-btn"} 
            onClick={() => changeLanguage("pt-BR")}
            title="Português">
              🇧🇷 PT
              </button>
            <button className={i18n.language === "en-US" ? "language-btn active" : "language-btn"} 
            onClick={() => changeLanguage("en-US")}
            title="English">
              🇺🇸 EN
            </button>
          </div>
          {/* perfil*/}
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
                  📦 {t("profile.estoque")}
                  </button>
                  <button className="user-menu-item danger" onClick={onLogout}>
                    ⎋  {t("profile.sair")}
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