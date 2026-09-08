import { useState, useEffect, useRef, useCallback } from "react";
import { fetchEstoqueWithAuth } from "./services/api.js";
import "./styles/Estoque.css";

// ── Helpers ────────────────────────────────────────────────────────────────
const DEFAULT_MIN  = 5; // min não existe na API, mantemos local
const sku          = (id) => "SKU-" + String(id).padStart(4, "0");
const getStatus    = (p)  => (p.quantidade === 0 ? "out" : p.quantidade <= (p.min ?? DEFAULT_MIN) ? "low" : "ok");
const getBarW      = (p)  => { const m = Math.max(p.quantidade, (p.min ?? DEFAULT_MIN) * 2, 1); return Math.min(100, Math.round((p.quantidade / m) * 100)); };
const getBarC      = (p)  => ({ out:"#ef4444", low:"#f59e0b", ok:"#22c55e" }[getStatus(p)]);
const BADGE_CLS    = { ok:"est-badge est-bok", low:"est-badge est-blow", out:"est-badge est-bout" };
const BADGE_LBL    = { ok:"Em estoque", low:"Estoque baixo", out:"Zerado" };

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
  const [f, setF] = useState(
    initial
      ? { nome: initial.nome, preco: initial.preco ?? 0 }
      : { nome: "", preco: "" }
  );
  const s = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const save = () => {
    if (!f.nome.trim()) return alert("Nome é obrigatório.");
    onSave({ nome: f.nome.trim(), preco: parseFloat(f.preco) || 0 });
  };

  return (
    <div className="est-mbg" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="est-mo">
        <div className="est-mt">{initial ? "Editar" : "Novo"} <em>produto</em></div>
        <div className="est-ms">
          {initial ? "Atualize o nome e o preço do item" : "Informe os dados do novo produto"}
        </div>
        <div className="est-fg">
          <label>Nome do produto</label>
          <input
            placeholder="Ex: Notebook Dell i7"
            value={f.nome}
            onChange={(e) => s("nome", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="est-fg">
          <label>Preço unitário (R$)</label>
          <input
            type="number" min="0" step="0.01" placeholder="0,00"
            value={f.preco}
            onChange={(e) => s("preco", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="est-mbtns">
          <button className="est-bcx" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="est-bsv" onClick={save} disabled={loading}>
            {loading ? "Salvando…" : "✓ Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Entrada / Saída de estoque ─────────────────────────────────────
function ModalMovimento({ produto, onClose, onConfirm, loading }) {
  const [tipo, setTipo]       = useState("entrada"); // "entrada" | "saida"
  const [quantidade, setQtd]  = useState("");

  const confirmar = () => {
    const q = parseInt(quantidade);
    if (!q || q <= 0) return alert("Informe uma quantidade válida.");
    if (tipo === "saida" && q > produto.quantidade)
      return alert(`Quantidade insuficiente. Estoque atual: ${produto.quantidade}`);
    onConfirm(tipo, q);
  };

  return (
    <div className="est-mbg" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="est-mo">
        <div className="est-mt">Movimentar <em>estoque</em></div>
        <div className="est-ms">Registre entrada ou saída de unidades</div>

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
          <label>Quantidade</label>
          <input
            type="number" min="1" placeholder="Ex: 10"
            value={quantidade}
            onChange={(e) => setQtd(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="est-mbtns">
          <button className="est-bcx" onClick={onClose} disabled={loading}>Cancelar</button>
          <button
            className={`est-bsv ${tipo}`}
            onClick={confirmar}
            disabled={loading}
          >
            {loading
              ? "Processando…"
              : tipo === "entrada"
                ? "▲ Confirmar entrada"
                : "▼ Confirmar saída"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Estoque({ onNavegar }) {
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
      setErro("Não foi possível carregar os produtos. " + e.message);
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
          Quantidade: 0
         }),
      });

      await carregarProdutos();
      setModal(null);
      showToast("✓ Produto adicionado!");
    } catch (e) {
      showToast("Erro: " + e.message, "err");
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
      showToast(`${emoji} ${tipo === "entrada" ? "Entrada" : "Saída"} de ${quantidade} un. registrada!`);
    } catch (e) {
      showToast("Erro: " + e.message, "err");
    } finally {
      setLA(false);
    }
  };

  // ── Excluir (requer endpoint DELETE na API — ver nota abaixo) ────────────
  const excluir = async (p) => {
    if (!confirm(`Remover "${p.nome}"?`)) return;
    setLA(true);
    try {
      // DELETE /api/produtos/{id}  ← precisa adicionar esse endpoint na API
      await apiFetch(`/api/Produtos/${p.id}`, { method: "DELETE" });
      await carregarProdutos();
      showToast("Produto removido.");
    } catch (e) {
      showToast("Erro ao remover: " + e.message, "err");
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
      lbl:"Total", val: produtos.length,
      sub: <><span className="est-tok">▲ {produtos.length}</span> itens</>,
      bwC:"est-bw est-bw0",
      bf: { width: anim ? `${Math.min(100, produtos.length * 8)}%` : "0%", background:"linear-gradient(90deg,#c084fc,#9333ea)" },
    },
    {
      C:"est-sc est-sc1", I:"est-sico est-sico1", emoji:"💰",
      lbl:"Valor total", val: `R$ ${(valorTotal).toFixed(2)}`,
      sub: <><span className="est-tok">▲</span> em estoque</>,
      bwC:"est-bw est-bw1",
      bf: { width: anim ? "78%" : "0%", background:"linear-gradient(90deg,#4ade80,#22c55e)" },
    },
    {
      C:"est-sc est-sc2", I:"est-sico est-sico2", emoji:"⚠️",
      lbl:"Estoque baixo", val: baixo,
      sub: <><span className="est-twarn">{baixo} item(s)</span> críticos</>,
      bwC:"est-bw est-bw2",
      bf: { width: anim ? `${Math.min(100, baixo * 20)}%` : "0%", background:"linear-gradient(90deg,#fbbf24,#f59e0b)" },
    },
    {
      C:"est-sc est-sc3", I:"est-sico est-sico3", emoji:"🔴",
      lbl:"Zerados", val: zerados,
      sub: <><span className="est-tdng">{zerados} item(s)</span> sem estoque</>,
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
              ← Voltar para o Dashboard
            </button>
          )}

          <div className="est-ey">
            Inventário · {new Date().toLocaleDateString("pt-BR", { month:"long", year:"numeric" })}
          </div>
          <h1 className="est-h1">Controle de <em>Estoque</em></h1>
          <div className="est-sub">Gerencie produtos, quantidades e alertas em tempo real</div>

          {erro && (
            <div className="est-err">
              ⚠ {erro}
              <button className="est-err-retry" onClick={carregarProdutos}>Tentar novamente</button>
            </div>
          )}

          {(zerados > 0 || baixo > 0) && !loadingPage && (
            <div className="est-abanner">
              <span>🔴</span>
              <div><strong>Atenção:</strong> {zerados} produto(s) sem estoque e {baixo} com quantidade crítica.</div>
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
              ＋ Adicionar produto
            </button>
          </div>

          <div className="est-tp">
            <div className="est-tp-inner">
              <div className="est-ph">
                <div className="est-ptitle">Produtos em estoque</div>
                <div className="est-pcnt">{produtos.length} itens</div>
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
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço unit.</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr><td colSpan={5} className="est-empty">Nenhum produto cadastrado</td></tr>
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
                            <td><span className={BADGE_CLS[st]}>{BADGE_LBL[st]}</span></td>
                            <td>
                              <div className="est-actions">
                                {/* ▲ Entrada */}
                                <button
                                  className="est-bi est-ben"
                                  title="Registrar entrada"
                                  disabled={loadingAct}
                                  onClick={() => setModal({ mov: p })}
                                >▲ Mov.</button>
                                {/* ✕ Excluir */}
                                <button
                                  className="est-bi est-bdl"
                                  title="Remover produto"
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
