import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fetchEstoqueWithAuth } from "./services/api.js";
import "./styles/Estoque.css";

// ── Helpers ────────────────────────────────────────────────────────────────
const DEFAULT_MIN  = 5; // min não existe na API, mantemos local
const sku          = (id) => "SKU-" + String(id).padStart(4, "0");
const getStatus    = (p)  => (p.quantidade === 0 ? "out" : p.quantidade <= (p.min ?? DEFAULT_MIN) ? "low" : "ok");
const getBarW      = (p)  => { const m = Math.max(p.quantidade, (p.min ?? DEFAULT_MIN) * 2, 1); return Math.min(100, Math.round((p.quantidade / m) * 100)); };
const getBarC      = (p)  => ({ out:"#ef4444", low:"#f59e0b", ok:"#22c55e" }[getStatus(p)]);
const BADGE_CLS    = { ok:"est-badge est-bok", low:"est-badge est-blow", out:"est-badge est-bout" };

// ── Hook: IntersectionObserver ─────────────────────────────────────────────
function useVis(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ref é um objeto estável, não precisa entrar nas deps
  return v;
}

// ── Modal: Adicionar / Editar produto ─────────────────────────────────────
function ModalProduto({ onClose, onSave, initial, loading }) {
  const { t } = useTranslation();
  const [f, setF] = useState(
    initial
      ? { nome: initial.nome, preco: initial.preco, quantidade: initial.quantidade ?? 0 }
      : { nome: "", preco: "", quantidade: "" }
  );
  const s = (j, k, l) => setF((x) => ({ ...x, [j]: k, l }));

  const save = () => {
    if (!f.nome.trim()) return alert(t("stock.messages.nameRequired"));
    onSave({ nome: f.nome.trim(), preco: parseFloat(f.preco), quantidade: parseInt(f.quantidade)});
  };

  return (
    <div className="est-mbg" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="est-mo">
        <div className="est-mt">
          {initial ? t("stock.modal.editProduct") : t("stock.modal.newProduct")}
        </div>
        <div className="est-ms">
          {initial
            ? t("stock.modal.editProductDescription")
            : t("stock.modal.newProductDescription")}
        </div>
        <div className="est-fg">
          <label>{t("stock.modal.productName")}</label>
          <input
            placeholder={t("stock.modal.productNamePlaceholder")}
            value={f.nome}
            onChange={(e) => s("nome", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="est-fg">
          <label>{t("stock.modal.unitPrice")}</label>
          <input
            type="number" min="0" step="0.10"
            placeholder={t("stock.modal.pricePlaceholder")}
            value={f.preco}
            onChange={(e) => s("preco", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="est-fg">
          <label>{t("stock.modal.quantity")}</label>
          <input type="number" min="0" step="1" placeholder="0"
            value={f.quantidade}
            onChange={(e) => s("quantidade", e.target.value)}
            disabled={loading} 
          />
        </div>
        <div className="est-mbtns">
          <button className="est-bcx" onClick={onClose} disabled={loading}>
            {t("stock.modal.cancel")}
          </button>
          <button className="est-bsv" onClick={save} disabled={loading}>
            {loading ? t("stock.modal.saving") : t("stock.modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Entrada / Saída de estoque ─────────────────────────────────────
function ModalMovimento({ produto, onClose, onConfirm, loading }) {
  const { t } = useTranslation();
  const [tipo, setTipo] = useState("entrada"); // "entrada" | "saida"
  const [quantidade, setQtd]  = useState("");

  const confirmar = () => {
    const q = parseInt(quantidade);
    if (!q || q <= 0) return alert(t("stock.messages.validQuantity"));
    if (tipo === "saida" && q > produto.quantidade)
      return alert(t("stock.messages.insufficientQuantity", { quantity: produto.quantidade }));
    onConfirm(tipo, q);
  };

  return (
    <div className="est-mbg" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="est-mo">
        <div className="est-mt">{t("stock.modal.movement")}</div>
        <div className="est-ms">{t("stock.modal.movementDescription")}</div>

        {/* Info do produto */}
        <div className="est-mpill">
          <div>
            <strong>{produto.nome}</strong>
            <div style={{ fontSize:11, color:"var(--color-text-muted)", marginTop:2 }}>{sku(produto.id)}</div>
          </div>
          <span>{produto.quantidade} un.</span>
        </div>

        {/* Seletor entrada / saída */}
        <div className="est-mtype">
          <button
            className={`est-mtbtn en ${tipo === "entrada" ? "act" : ""}`}
            onClick={() => setTipo("entrada")}
            disabled={loading}
          >
            ▲ Entrada
          </button>
          <button
            className={`est-mtbtn sa ${tipo === "saida" ? "act" : ""}`}
            onClick={() => setTipo("saida")}
            disabled={loading}
          >
            ▼ Saída
          </button>
        </div>

        <div className="est-fg">
          <label>{t("stock.modal.quantity")}</label>
          <input
            type="number" min="1" placeholder={t("stock.modal.quantityPlaceholder")}
            value={quantidade}
            onChange={(e) => setQtd(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="est-mbtns">
          <button className="est-bcx" onClick={onClose} disabled={loading}>
            {t("stock.modal.cancel")}
          </button>
          <button
            className={`est-bsv ${tipo}`}
            onClick={confirmar}
            disabled={loading}
          >
            {loading
              ? t("stock.modal.processing")
              : tipo === "entrada"
                ? t("stock.modal.confirmEntry")
                : t("stock.modal.confirmExit")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal: excluir
function ModalExcluir({produto, onClose, onConfirm, loading}) {
  const [d, setD] = useState("excluir");
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Estoque({ onNavegar }) {
  const { t } = useTranslation();
  const [produtos,  setProdutos]  = useState([]);
  const [loadingPage, setLP]      = useState(true);
  const [loadingAct,  setLA]      = useState(false);
  const [erro,      setErro]      = useState("");
  const [modal,     setModal]     = useState(null); // null | "novo" | produto (editar) | { mov: produto }
  const [toast,     setToast]     = useState(null); // { msg, tipo }
  const [anim,      setAnim]      = useState(false);

  const sRef = useRef(null);
  const sVis = useVis(sRef);

  // ── API helpers ──────────────────────────────────────────────────────────
  const apiFetch = useCallback(async (path, options = {}) => {
    const res = await fetchEstoqueWithAuth(path, options);

    if (!res.ok) { 
      let message = `Erro HTTP ${res.status}`

      try {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const data = await res.json();
          message = data.message || data.title || message;
        } else {
           const text = await res.text();
            if (text) message = text;
        }
      } catch (error) {
        
      }
      throw new Error(message);
    }
    return res.json();
  }, []);

  const carregarProdutos = useCallback(async () => {
    try {
      setErro("");
      const data = await apiFetch("/api/Produtos");
      // A API retorna campos em PascalCase (Id, Nome, Quantidade, Preco)
      // Normalizamos para camelCase
      setProdutos(data.map((p) => ({
        id:         p.Id         ?? p.id,
        nome:       p.Nome       ?? p.nome,
        quantidade: p.Quantidade ?? p.quantidade ?? 0,
        preco:      p.Preco      ?? p.preco      ?? 0,
      })));
    } catch (e) {
      setErro(t("stock.messages.loadError", { error: e.message }));
    } finally {
      setLP(false);
    }
  }, [apiFetch]);

  useEffect(() => {
  let ativo = true;
  const load = async () => {
    if (ativo) await carregarProdutos();
  };
  load();
  return () => { ativo = false; };
}, [carregarProdutos]);
  useEffect(() => { const t = setTimeout(() => setAnim(true), 350); return () => clearTimeout(t); }, []);

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, tipo = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Criar produto ────────────────────────────────────────────────────────
  const salvarProduto = async (form) => {
    setLA(true);
    try {
      // POST /api/produtos  → body: { Nome, Preco, Quantidade }
      await apiFetch("/api/Produtos", {
        method: "POST",
        body: JSON.stringify({ 
          Nome: form.nome,
          Preco: form.preco,
          Quantidade: form.quantidade
         }),
      });

      await carregarProdutos();
      setModal(null);
      showToast(t("stock.messages.addSuccess"));
    } catch (e) {
      showToast(t("stock.messages.error", { error: e.message }), "err");
    } finally {
      setLA(false);
    }
  };

  // ── Movimentar estoque (Entrada ou Saída) ────────────────────────────────
  const confirmarMovimento = async (tipo, quantidade) => {
    const produto = modal.mov;
    setLA(true);
    try {
      // POST /api/produtos/entrada?id=X&quantidade=Y
      // POST /api/produtos/saida?id=X&quantidade=Y
      await apiFetch(`/api/Produtos/${tipo}?id=${produto.id}&quantidade=${quantidade}`, {
        method: "POST",
      });
      await carregarProdutos();
      setModal(null);
      const emoji = tipo === "entrada" ? "▲" : "▼";
      showToast(t("stock.messages.movementSuccess", {
        emoji,
        type: tipo === "entrada" ? "Entrada" : "Saída",
        quantity,
      }));
    } catch (e) {
      showToast(t("stock.messages.error", { error: e.message }), "err");
    } finally {
      setLA(false);
    }
  };

  // ── Excluir (requer endpoint DELETE na API — ver nota abaixo) ────────────
  const excluir = async (p) => {
    if (!confirm(t("stock.messages.removeConfirm", { name: p.nome }))) return;
    setLA(true);
    try {
      // DELETE /api/produtos/{id}  ← precisa adicionar esse endpoint na API
      await apiFetch(`/api/Produtos/${p.id}`, { method: "DELETE" });
      await carregarProdutos();
      showToast(t("stock.messages.removeSuccess"));
    } catch (e) {
      showToast(t("stock.messages.error", { error: e.message }), "err");
    } finally {
      setLA(false);
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const zerados    = produtos.filter((p) => getStatus(p) === "out").length;
  const baixo      = produtos.filter((p) => getStatus(p) === "low").length;
  const valorTotal = produtos.reduce((a, p) => a + p.quantidade * p.preco, 0);

  const STATS = [
    {
      C:"est-sc est-sc0", I:"est-sico est-sico0", emoji:"📦",
      lbl: t("stock.stats.total"),
      val: produtos.length,
      sub: <><span className="est-tok">▲ {produtos.length}</span> {t("stock.stats.items")}</>,
      bwC:"est-bw est-bw0",
      bf: { width: anim ? `${Math.min(100, produtos.length * 8)}%` : "0%", background:"linear-gradient(90deg,#c084fc,#9333ea)" },
    },
    {
      C:"est-sc est-sc1", I:"est-sico est-sico1", emoji:"💰",
      lbl: t("stock.stats.totalValue"),
      val: `R$ ${(valorTotal).toFixed(2)}`,
      sub: <><span className="est-tok">▲</span> {t("stock.stats.inStock")}</>,
      bwC:"est-bw est-bw1",
      bf: { width: anim ? "78%" : "0%", background:"linear-gradient(90deg,#4ade80,#22c55e)" },
    },
    {
      C:"est-sc est-sc2", I:"est-sico est-sico2", emoji:"⚠️",
      lbl: t("stock.stats.lowStock"),
      val: baixo,
      sub: <><span className="est-twarn">{baixo} {t("stock.stats.criticalItems")}</span> {t("stock.stats.critical")}</>,
      bwC:"est-bw est-bw2",
      bf: { width: anim ? `${Math.min(100, baixo * 20)}%` : "0%", background:"linear-gradient(90deg,#fbbf24,#f59e0b)" },
    },
    {
      C:"est-sc est-sc3", I:"est-sico est-sico3", emoji:"🔴",
      lbl: t("stock.stats.outOfStock"),
      val: zerados,
      sub: <><span className="est-tdng">{zerados} {t("stock.stats.criticalItems")}</span> {t("stock.stats.withoutStock")}</>,
      bwC:"est-bw est-bw3",
      bf: { width: anim ? `${Math.min(100, zerados * 20)}%` : "0%", background:"linear-gradient(90deg,#f87171,#ef4444)" },
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="est-shell">
        <div className="est-pw">

          {onNavegar && (
            <button className="est-back" onClick={() => onNavegar("mei")}>
              ← {t("stock.back")}
            </button>
          )}

          <div className="est-ey">
            {t("stock.inventory")} · {new Date().toLocaleDateString("pt-BR", { month:"long", year:"numeric" })}
          </div>
          <h1 className="est-h1">{t("stock.title")}</h1>
          <div className="est-sub">{t("stock.subtitle")}</div>

          {erro && (
            <div className="est-err">
              ⚠ {erro}
              <button className="est-err-retry" onClick={carregarProdutos}>{t("stock.tryAgain")}</button>
            </div>
          )}

          {(zerados > 0 || baixo > 0) && !loadingPage && (
            <div className="est-abanner">
              <span>🔴</span>
              <div><strong>{t("stock.attention")}:</strong> {zerados} {t("stock.outOfStock")} {t("stock.and")} {baixo} {t("stock.critical")}.</div>
            </div>
          )}

          <div className="est-sg" ref={sRef}>
            {STATS.map((s, i) => (
              <div key={i} className={`${s.C}${sVis ? " vis" : ""}`}>
                <div className={s.I}>{s.emoji}</div>
                <div className="est-slbl">{s.lbl}</div>
                <div className="est-sval">{s.val}</div>
                <div className={s.bwC}><div className="est-bf" style={s.bf} /></div>
                <div className="est-ssub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="est-tb">
            <button className="est-bp" onClick={() => setModal("novo")} disabled={loadingAct}>
              ＋ {t("stock.actions.add")}
            </button>
          </div>

          <div className="est-tp">
            <div className="est-tp-inner">
              <div className="est-ph">
                <div className="est-ptitle">{t("stock.products.title")}</div>
                <div className="est-pcnt">{produtos.length} {t("stock.stats.items")}</div>
              </div>

              {loadingPage ? (
                <div className="est-loading">
                  <div className="est-spinner" />
                  Carregando produtos…
                </div>
              ) : (
                <table className="est-table">
                  <thead>
                    <tr>
                      <th>{t("stock.products.product")}</th>
                      <th>{t("stock.products.quantity")}</th>
                      <th>{t("stock.products.unitPrice")}</th>
                      <th>{t("stock.products.status")}</th>
                      <th>{t("stock.products.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr><td colSpan={5} className="est-empty">{t("stock.products.none")}</td></tr>
                    ) : (
                      produtos.map((p) => {
                        const st = getStatus(p);
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="est-pn">{p.nome}</div>
                              <div className="est-ps">{sku(p.id)}</div>
                            </td>
                            <td>
                              <div className="est-qr">
                                <span className="est-qn">{p.quantidade}</span>
                                <div className="est-qb">
                                  <div className="est-qbf" style={{ width: anim ? `${getBarW(p)}%` : "0%", background: getBarC(p) }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="est-pr">
                                R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits:2 })}
                              </span>
                            </td>
                            <td><span className={BADGE_CLS[st]}>{t(`stock.status.${st === "ok" ? "inStock" : st}`)}</span></td>
                            <td>
                              <div className="est-actions">
                                {/* ▲ Entrada */}
                                <button
                                  className="est-bi est-ben"
                                  title={t("stock.actions.registerEntry")}
                                  disabled={loadingAct}
                                  onClick={() => setModal({ mov: p })}
                                >▲ Mov.</button>
                                {/* ✕ Excluir */}
                                <button
                                  className="est-bi est-bdl"
                                  title={t("stock.actions.remove")}
                                  disabled={loadingAct}
                                  onClick={() => excluir(p)}
                                >✕</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Novo produto */}
      {modal === "novo" && (
        <ModalProduto
          onClose={() => setModal(null)}
          onSave={salvarProduto}
          loading={loadingAct}
        />
      )}

      {/* Modal: Movimentação */}
      {modal?.mov && (
        <ModalMovimento
          produto={modal.mov}
          onClose={() => setModal(null)}
          onConfirm={confirmarMovimento}
          loading={loadingAct}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`est-toast ${toast.tipo}`}>{toast.msg}</div>
      )}
    </>
  );
}
