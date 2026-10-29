
import { useCallback, useEffect, useState } from "react";
import { fetchEstoqueWithAuth } from "../services/api.js";

export default function useVendas() {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarVendas = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const response = await fetchEstoqueWithAuth("/api/Vendas");

      if (!response.ok) {
        let mensagem = `Erro ao carregar vendas (${response.status}).`;

        try {
          const contentType =
            response.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            const data = await response.json();
            mensagem = data.message || data.title || mensagem;
          }
        } catch {
          // Mantém a mensagem padrão.
        }

        throw new Error(mensagem);
      }

      const dados = await response.json();

      const vendasNormalizadas = (dados || []).map((venda) => ({
        id: venda.Id ?? venda.id,
        data: venda.Data ?? venda.data,
        valorTotal: Number(
          venda.ValorTotal ?? venda.valorTotal ?? 0
        ),
        itens: (venda.Itens ?? venda.itens ?? []).map((item) => ({
          produtoId: item.ProdutoId ?? item.produtoId,
          nomeProduto: item.NomeProduto ?? item.nomeProduto,
          quantidade: Number(
            item.Quantidade ?? item.quantidade ?? 0
          ),
          precoUnitario: Number(
            item.PrecoUnitario ?? item.precoUnitario ?? 0
          ),
          subtotal: Number(
            item.Subtotal ?? item.subtotal ?? 0
          ),
        })),
      }));

      setVendas(vendasNormalizadas);
    } catch (error) {
      setErro(
        error.message || "Não foi possível carregar as vendas."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarVendas();
  }, [carregarVendas]);

  return {
    vendas,
    carregando,
    erro,
    recarregar: carregarVendas,
  };
}
