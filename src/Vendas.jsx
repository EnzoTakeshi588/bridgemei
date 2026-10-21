import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/Vendas.css";

/**
 * Subtela de vendas do BridgeMEI.
 *
 * Props opcionais para conectar à API:
 * - produtos: [{ id, nome, quantidade, preco }]
 * - vendas: [{ id, data, valorTotal, itens: [{ produtoId, nomeProduto, quantidade, precoUnitario, subtotal }] }]
 * - onRegistrarVenda: async ({ itens: [{ produtoId, quantidade }] }) => void
 *
 * Se não forem fornecidos, o componente usa dados demonstrativos locais.
 */
const produtosDemo = [
  { id: 1, nome: "Caderno", quantidade: 24, preco: 18.9 },
  { id: 2, nome: "Caneta azul", quantidade: 80, preco: 2.5 },
  { id: 3, nome: "Mochila", quantidade: 7, preco: 89.9 },
];

const vendasDemo = [
  {
    id: 1042,
    data: "2026-10-21T10:35:00",
    valorTotal: 125,
    itens: [
      { produtoId: 1, nomeProduto: "Caderno", quantidade: 2, precoUnitario: 18.9, subtotal: 37.8 },
      { produtoId: 3, nomeProduto: "Mochila", quantidade: 1, precoUnitario: 87.2, subtotal: 87.2 },
    ],
  },
  {
    id: 1041,
    data: "2026-10-20T16:20:00",
    valorTotal: 68,
    itens: [
      { produtoId: 2, nomeProduto: "Caneta azul", quantidade: 8, precoUnitario: 2.5, subtotal: 20 },
      { produtoId: 1, nomeProduto: "Caderno", quantidade: 2, precoUnitario: 24, subtotal: 48 },
    ],
  },
];

const money = (value, locale) =>
  new Intl.NumberFormat(locale || "pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);

const dateTime = (value, locale) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale || "pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const getId = (product) => product?.id ?? product?.produtoId ?? product?.ProdutoId;
const getName = (product) => product?.nome ?? product?.Nome ?? product?.nomeProduto ?? product?.NomeProduto ?? "";
const getStock = (product) => Number(product?.quantidade ?? product?.Quantidade ?? 0);
const getPrice = (product) => Number(product?.preco ?? product?.Preco ?? 0);

export default function Vendas({
  produtos: produtosProp,
  vendas: vendasProp,
  onRegistrarVenda,
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "pt-BR";

  const [vendasLocais, setVendasLocais] = useState(vendasDemo);
  const [produtosLocais, setProdutosLocais] = useState(produtosDemo);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [itens, setItens] = useState([{ produtoId: "", quantidade: 1 }]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const produtos = produtosProp ?? produtosLocais;
  const vendas = vendasProp ?? vendasLocais;

  const vendasOrdenadas = useMemo(
    () => [...vendas].sort((a, b) => new Date(b.data ?? b.Data ?? 0) - new Date(a.data ?? a.Data ?? 0)),
    [vendas]
  );

  const receitaTotal = useMemo(
    () => vendas.reduce((sum, venda) => sum + Number(venda.valorTotal ?? venda.ValorTotal ?? 0), 0),
    [vendas]
  );

  const itensCalculados = useMemo(
    () =>
      itens.map((item) => {
        const produto = produtos.find((p) => String(getId(p)) === String(item.produtoId));
        const quantidade = Math.max(0, Number(item.quantidade) || 0);
        const preco = produto ? getPrice(produto) : 0;
        return {
          ...item,
          produto,
          quantidade,
          preco,
          subtotal: quantidade * preco,
          nomeProduto: produto ? getName(produto) : "",
          estoque: produto ? getStock(produto) : 0,
        };
      }),
    [itens, produtos]
  );

  const totalFormulario = itensCalculados.reduce((sum, item) => sum + item.subtotal, 0);

  const atualizarItem = (index, campo, valor) => {
    setItens((atual) => atual.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)));
    setErro("");
  };

  const adicionarItem = () => setItens((atual) => [...atual, { produtoId: "", quantidade: 1 }]);

  const removerItem = (index) => {
    setItens((atual) => (atual.length === 1 ? [{ produtoId: "", quantidade: 1 }] : atual.filter((_, i) => i !== index)));
    setErro("");
  };

  const abrirModal = () => {
    setItens([{ produtoId: "", quantidade: 1 }]);
    setErro("");
    setModalAberto(true);
  };

  const solicitarConfirmacao = (event) => {
    event.preventDefault();
    const preenchidos = itensCalculados.filter((item) => item.produtoId !== "");
    if (!preenchidos.length) {
      setErro(t("vendas.form.errors.addProduct"));
      return;
    }
    if (preenchidos.some((item) => !item.produto || item.quantidade < 1)) {
      setErro(t("vendas.form.errors.invalidItem"));
      return;
    }
    if (preenchidos.some((item) => item.quantidade > item.estoque)) {
      setErro(t("vendas.form.errors.insufficientStock"));
      return;
    }
    setErro("");
    setConfirmacaoAberta(true);
  };

  const confirmarVenda = useCallback(async () => {
    const itensValidos = itensCalculados.filter((item) => item.produtoId !== "");
    setSalvando(true);
    setErro("");
    try {
      if (onRegistrarVenda) {
        await onRegistrarVenda({
          itens: itensValidos.map((item) => ({
            produtoId: Number(item.produtoId),
            quantidade: item.quantidade,
          })),
        });
      } else {
        // Modo demonstrativo local; substitua por onRegistrarVenda ao integrar a API.
        const novaVenda = {
          id: Math.max(0, ...vendasLocais.map((v) => Number(v.id) || 0)) + 1,
          data: new Date().toISOString(),
          valorTotal: itensValidos.reduce((sum, item) => sum + item.subtotal, 0),
          itens: itensValidos.map((item) => ({
            produtoId: Number(item.produtoId),
            nomeProduto: item.nomeProduto,
            quantidade: item.quantidade,
            precoUnitario: item.preco,
            subtotal: item.subtotal,
          })),
        };
        setVendasLocais((atual) => [novaVenda, ...atual]);
        setProdutosLocais((atual) =>
          atual.map((produto) => {
            const quantidadeVendida = itensValidos
              .filter((item) => String(item.produtoId) === String(getId(produto)))
              .reduce((sum, item) => sum + item.quantidade, 0);
            return { ...produto, quantidade: getStock(produto) - quantidadeVendida };
          })
        );
      }
      setConfirmacaoAberta(false);
      setModalAberto(false);
      setItens([{ produtoId: "", quantidade: 1 }]);
    } catch (e) {
      setErro(e?.message || t("vendas.form.errors.saveFailed"));
      setConfirmacaoAberta(false);
    } finally {
      setSalvando(false);
    }
  }, [itensCalculados, onRegistrarVenda, t, vendasLocais]);

  return (
    <section className="vendas-shell">
      <header className="vendas-heading">
        <div>
          <div className="page-eyebrow">{t("vendas.eyebrow")}</div>
          <h1 className="page-h1">{t("vendas.titleBefore")}<em>{t("vendas.title-em")}</em>{t("vendas.titleAfter")}</h1>
          <p className="vendas-subtitle">{t("vendas.subtitle")}</p>
        </div>
      </header>

      <div className="vendas-summary">
        
        <article className="vendas-card vendas-card-total">
          <div className="vendas-card-icon" aria-hidden="true">🧾</div>
          <div className="vendas-card-content">
            <span className="vendas-card-label">{t("vendas.cards.totalSales")}</span>
            <strong className="vendas-card-value">{vendas.length}</strong>
            <span className="vendas-card-hint">{t("vendas.cards.totalSalesHint")}</span>
          </div>
        </article>

        <div className="vendas-revenue-column">
          <div className="vendas-new-sale-row">
            <button className="vendas-primary-btn" type="button" onClick={abrirModal}>
              <span aria-hidden="true">＋</span> {t("vendas.actions.newSale")}
            </button>
          </div>
          <article className="vendas-card vendas-card-revenue">
          <div className="vendas-revenue-body">
            <div className="vendas-card-icon" aria-hidden="true">💰</div>
            <div className="vendas-card-content">
              <span className="vendas-card-label">{t("vendas.cards.totalRevenue")}</span>
              <strong className="vendas-card-value">{money(receitaTotal, locale)}</strong>
              <span className="vendas-card-hint">{t("vendas.cards.totalRevenueHint")}</span>
            </div>
          </div>
          </article>
        </div>
      </div>

      <section className="vendas-history">
        <div className="vendas-section-heading">
          <div>
            <h2>{t("vendas.history.title")}</h2>
            <p>{t("vendas.history.subtitle")}</p>
          </div>
          <span className="vendas-history-count">{t("vendas.history.count", { count: vendas.length })}</span>
        </div>

        {vendasOrdenadas.length === 0 ? (
          <div className="vendas-empty">
            <span className="vendas-empty-emoji" aria-hidden="true">🛍️</span>
            <h3>{t("vendas.history.emptyTitle")}</h3>
            <p>{t("vendas.history.emptyDescription")}</p>
            <button className="vendas-primary-btn" type="button" onClick={abrirModal}>
              <span aria-hidden="true">＋</span> {t("vendas.actions.newSale")}
            </button>
          </div>
        ) : (
          <div className="vendas-table-wrap">
            <table className="vendas-table">
              <thead>
                <tr>
                  <th>{t("vendas.history.columns.sale")}</th>
                  <th>{t("vendas.history.columns.date")}</th>
                  <th>{t("vendas.history.columns.items")}</th>
                  <th>{t("vendas.history.columns.total")}</th>
                  <th>{t("vendas.history.columns.details")}</th>
                </tr>
              </thead>
              <tbody>
                {vendasOrdenadas.map((venda, index) => {
                  const vendaId = venda.id ?? venda.Id ?? `demo-${index}`;
                  const data = venda.data ?? venda.Data;
                  const total = venda.valorTotal ?? venda.ValorTotal ?? 0;
                  const listaItens = venda.itens ?? venda.Itens ?? [];
                  const quantidadeItens = listaItens.reduce((sum, item) => sum + Number(item.quantidade ?? item.Quantidade ?? 0), 0);
                  return (
                    <tr key={vendaId}>
                      <td>
                        <span className="vendas-sale-id">#{vendaId}</span>
                      </td>
                      <td>{dateTime(data, locale)}</td>
                      <td>{t("vendas.history.itemCount", { count: quantidadeItens })}</td>
                      <td className="vendas-money-cell">{money(total, locale)}</td>
                      <td>
                        <details className="vendas-details">
                          <summary>{t("vendas.history.viewDetails")}</summary>
                          <div className="vendas-details-popover">
                            {listaItens.length ? listaItens.map((item, itemIndex) => (
                              <div className="vendas-detail-line" key={`${vendaId}-${item.produtoId ?? item.ProdutoId ?? itemIndex}`}>
                                <span>
                                  <strong>{item.nomeProduto ?? item.NomeProduto ?? item.produto?.nome ?? item.Produto?.Nome ?? t("vendas.history.deletedProduct")}</strong>
                                  <small>{Number(item.quantidade ?? item.Quantidade ?? 0)} × {money(item.precoUnitario ?? item.PrecoUnitario ?? 0, locale)}</small>
                                </span>
                                <b>{money(item.subtotal ?? item.Subtotal ?? 0, locale)}</b>
                              </div>
                            )) : <p className="vendas-details-empty">{t("vendas.history.noItems")}</p>}
                          </div>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalAberto && (
        <div className="vendas-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !confirmacaoAberta && !salvando) setModalAberto(false);
        }}>
          <section className="vendas-modal" role="dialog" aria-modal="true" aria-labelledby="vendas-form-title">
            <header className="vendas-modal-header">
              <div>
                <span className="vendas-modal-kicker">🛒 {t("vendas.form.kicker")}</span>
                <h2 className="page-h2">{t("vendas.form.title")}<em>{t("vendas.form.title-em")}</em></h2>
                <p>{t("vendas.form.subtitle")}</p>
              </div>
              <button className="vendas-icon-btn" type="button" aria-label={t("vendas.actions.close")} onClick={() => setModalAberto(false)} disabled={salvando}>×</button>
            </header>

            <form onSubmit={solicitarConfirmacao}>
              <div className="vendas-form-items">
                {itens.map((item, index) => {
                  const calculado = itensCalculados[index];
                  return (
                    <div className="vendas-form-item" key={index}>
                      <div className="vendas-form-item-top">
                        <span className="vendas-item-number">{t("vendas.form.itemNumber", { number: index + 1 })}</span>
                        <button className="vendas-remove-item" type="button" onClick={() => removerItem(index)} aria-label={t("vendas.form.removeItem")} disabled={itens.length === 1}>✕</button>
                      </div>
                      <label>
                        {t("vendas.form.product")}
                        <select value={item.produtoId} onChange={(e) => atualizarItem(index, "produtoId", e.target.value)} required>
                          <option value="">{t("vendas.form.chooseProduct")}</option>
                          {produtos.map((produto) => (
                            <option key={getId(produto)} value={getId(produto)} disabled={getStock(produto) <= 0}>
                              {getName(produto)} — {money(getPrice(produto), locale)} · {t("vendas.form.stock", { count: getStock(produto) })}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="vendas-form-item-bottom">
                        <label>
                          {t("vendas.form.quantity")}
                          <input
                            type="number"
                            min="1"
                            max={calculado?.estoque || undefined}
                            step="1"
                            value={item.quantidade}
                            onChange={(e) => atualizarItem(index, "quantidade", e.target.value)}
                            required
                          />
                        </label>
                        <div className="vendas-item-subtotal">
                          <span>{t("vendas.form.subtotal")}</span>
                          <strong>{money(calculado?.subtotal, locale)}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="vendas-add-item" type="button" onClick={adicionarItem}>＋ {t("vendas.form.addProduct")}</button>

              <div className="vendas-form-total">
                <span>{t("vendas.form.saleTotal")}</span>
                <strong>{money(totalFormulario, locale)}</strong>
              </div>

              {erro && <p className="vendas-error" role="alert">⚠️ {erro}</p>}

              <footer className="vendas-modal-actions">
                <button className="vendas-secondary-btn" type="button" onClick={() => setModalAberto(false)} disabled={salvando}>{t("vendas.actions.cancel")}</button>
                <button className="vendas-primary-btn" type="submit" disabled={salvando || !produtos.length}>{t("vendas.actions.register")}</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {confirmacaoAberta && (
        <div className="vendas-modal-backdrop vendas-confirm-backdrop" role="presentation">
          <section className="vendas-modal vendas-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="vendas-confirm-title" aria-describedby="vendas-confirm-description">
            <div className="vendas-confirm-icon" aria-hidden="true">🧾</div>
            <h2 id="vendas-confirm-title">{t("vendas.confirm.title")}</h2>
            <p id="vendas-confirm-description">{t("vendas.confirm.description")}</p>
            <div className="vendas-confirm-summary">
              <span>{t("vendas.confirm.products", { count: itensCalculados.filter((item) => item.produtoId !== "").length })}</span>
              <strong>{money(totalFormulario, locale)}</strong>
            </div>
            {erro && <p className="vendas-error" role="alert">⚠️ {erro}</p>}
            <footer className="vendas-modal-actions">
              <button className="vendas-secondary-btn" type="button" onClick={() => setConfirmacaoAberta(false)} disabled={salvando}>{t("vendas.actions.cancel")}</button>
              <button className="vendas-primary-btn" type="button" onClick={confirmarVenda} disabled={salvando}>
                {salvando ? t("vendas.actions.saving") : t("vendas.confirm.confirm")}
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
