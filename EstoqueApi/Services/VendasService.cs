using System.Data;
using EstoqueApi.Data;
using EstoqueApi.Models;
using EstoqueApi.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EstoqueApi.Services
{
    public class VendasService
    {
        private readonly AppDbContext _context;

        public VendasService(AppDbContext context)
        {
            _context = context;
        }

        public Venda Registrar(List<ItemVendaRequest> itensSolicitados, int usuarioId)
    {
        if (itensSolicitados == null || itensSolicitados.Count == 0)
            throw new ArgumentException("A venda precisa ter pelo menos um produto.");

        if (itensSolicitados.Any(i =>
            i.ProdutoId <= 0 || i.Quantidade <= 0))
        {
            throw new ArgumentException("Os produtos e as quantidades devem ser válidos.");
        }

        // Agrupa produtos repetidos na mesma venda.
        var quantidadesPorProduto = itensSolicitados
            .GroupBy(i => i.ProdutoId)
            .ToDictionary(
                grupo => grupo.Key,
                grupo => grupo.Sum(i => i.Quantidade));

        using var transacao = _context.Database.BeginTransaction(IsolationLevel.Serializable);

        var idsProdutos = quantidadesPorProduto.Keys.ToList();

        var produtos = _context.Produtos
            .Where(p =>
                idsProdutos.Contains(p.Id) &&
                p.UsuarioId == usuarioId)
            .ToList();

        if (produtos.Count != idsProdutos.Count)
            throw new KeyNotFoundException("Um ou mais produtos não foram encontrados.");

        // Valida todo o estoque antes de realizar as baixas.
        foreach (var produto in produtos)
        {
            if (produto.Preco < 0)
                throw new InvalidOperationException($"O preço do produto {produto.Nome} é inválido.");

            if (produto.Quantidade <
                quantidadesPorProduto[produto.Id])
            {
                throw new InvalidOperationException($"Estoque insuficiente para o produto {produto.Nome}.");
            }
        }

        var venda = new Venda
        {
            UsuarioId = usuarioId,
            Data = DateTime.UtcNow,
            ValorTotal = 0
        };

        _context.Vendas.Add(venda);
        _context.SaveChanges();

        foreach (var produto in produtos)
        {
            var quantidade = quantidadesPorProduto[produto.Id];
            var subtotal = produto.Preco * quantidade;

            venda.Itens.Add(new ItemVenda
            {
                VendaId = venda.Id,
                ProdutoId = produto.Id,
                ProdutoIdHistorico = produto.Id,
                Produto = produto,
                NomeProduto = produto.Nome,
                Quantidade = quantidade,
                PrecoUnitario = produto.Preco,
                Subtotal = subtotal
            });

            venda.ValorTotal += subtotal;

            produto.Quantidade -= quantidade;

            _context.MovimentarEstoque.Add(
                new MovimentarEstoque
                {
                    ProdutoId = produto.Id,
                    ProdutoIdHistorico = produto.Id,
                    NomeProduto = produto.Nome,
                    UsuarioId = usuarioId,
                    Tipo = "Venda",
                    Quantidade = quantidade,
                    VendaId = venda.Id,
                    Data = DateTime.UtcNow
                });
        }

        _context.SaveChanges();
        transacao.Commit();

        return venda; 
        }
    }
}