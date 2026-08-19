using EstoqueApi.Data;
using EstoqueApi.Models;

namespace EstoqueApi.Services
{
    public class EstoqueService
    {
        private readonly AppDbContext _context;

        public EstoqueService(AppDbContext context)
        {
            _context = context;
        }

        public List<Produto> Listar()
        {
            return _context.Produtos.ToList();
        }

        public Produto Criar(Produto produto)
        {
            if (string.IsNullOrWhiteSpace(produto.Nome))
                throw new ArgumentException("O nome do produto é obrigatório");

            if (produto.Quantidade < 0)
                throw new ArgumentException("A quantidade não pode ser negativa");

            if (produto.Preco < 0)
                throw new ArgumentException("O preço não pode ser negativo");

            produto.Id = 0;

            _context.Produtos.Add(produto);
            _context.SaveChanges();

            return produto;
        }

        public Produto Entrada(int id, int quantidade)
        {
            if(quantidade <= 0)
                throw new ArgumentException("Quantidade deve ser maior que zero.");

            var produto = _context.Produtos.Find(id);

            if (produto == null)
                throw new KeyNotFoundException("Produto não encontrado");

            produto.Quantidade += quantidade;

            _context.SaveChanges();

            return produto;
        }

        public Produto Saida(int id, int quantidade)
        {
            if(quantidade <= 0)
                throw new ArgumentException("Quantidade deve ser maior que zero");

            var produto = _context.Produtos.Find(id);

            if (produto == null)
                throw new KeyNotFoundException("Produto não encontrado");
            
            if(quantidade > produto.Quantidade)
                throw new InvalidOperationException("Quantidade insuficiente em estoque");

            produto.Quantidade -= quantidade;

            _context.SaveChanges();

            return produto;
        }
        public Produto Excluir(int id)
        {
            var produto = _context.Produtos.Find(id);
            
            if (produto == null)
             throw new KeyNotFoundException("Produto não encontrado");

            _context.Produtos.Remove(produto);
            _context.SaveChanges();
            
            return produto;
        }
    }
}