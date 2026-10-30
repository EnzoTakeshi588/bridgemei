
export function calcularMetricasVendas(vendas) {
  const agora = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth();

  const vendasValidas = vendas.filter((venda) => {
    const data = new Date(venda.data);

    return (
      !Number.isNaN(data.getTime()) &&
      Number.isFinite(venda.valorTotal)
    );
  });

  const vendasDoAno = vendasValidas.filter(
    (venda) => new Date(venda.data).getFullYear() === anoAtual
  );

  const vendasDoMes = vendasDoAno.filter(
    (venda) => new Date(venda.data).getMonth() === mesAtual
  );

  const somarFaturamento = (lista) =>
    lista.reduce((total, venda) => total + venda.valorTotal, 0);

  const faturamentoTotal = somarFaturamento(vendasValidas);
  const faturamentoAnual = somarFaturamento(vendasDoAno);
  const faturamentoMensal = somarFaturamento(vendasDoMes);

  const ticketMedio =
    vendasValidas.length > 0
      ? faturamentoTotal / vendasValidas.length
      : 0;

  const meses = Array.from({ length: 12 }, (_, mes) => {
    const vendasDoMesAtual = vendasDoAno.filter(
      (venda) => new Date(venda.data).getMonth() === mes
    );

    return {
      mes,
      total: somarFaturamento(vendasDoMesAtual),
      quantidade: vendasDoMesAtual.length,
    };
  });

  const mesesComVendas = meses.filter((mes) => mes.quantidade > 0);

  const melhorMes =
    mesesComVendas.length > 0
      ? mesesComVendas.reduce((melhor, atual) =>
          atual.total > melhor.total ? atual : melhor
        )
      : null;

  return {
    quantidadeVendas: vendasValidas.length,
    quantidadeVendasAnual: vendasDoAno.length,
    quantidadeVendasMensal: vendasDoMes.length,
    faturamentoTotal,
    faturamentoAnual,
    faturamentoMensal,
    ticketMedio,
    meses,
    melhorMes,
  };
}
