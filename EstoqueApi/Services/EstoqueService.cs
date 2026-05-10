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

        public Produto Criar(string nome)
        {
            var produto = new Produto
            {
                Nome = nome,
                Quantidade = 0
            };

            _context.Produtos.Add(produto);
            _context.SaveChanges();

            return produto;
        }

        public Produto Entrada(int id, int quantidade)
        {
            var produto = _context.Produtos.Find(id);

            if (produto == null)
                throw new Exception("Produto não encontrado");

            produto.Quantidade += quantidade;
            _context.SaveChanges();

            return produto;
        }

        public Produto Saida(int id, int quantidade)
        {
            var produto = _context.Produtos.Find(id);

            if (produto == null)
                throw new Exception("Produto não encontrado");

            produto.Quantidade -= quantidade;
            _context.SaveChanges();

            return produto;
        }
        public Produto Excluir(int id)
        {
            var produto = _context.Produtos.Find(id);
            if (produto == null) throw new Exception("Produto não encontrado");
            _context.Produtos.Remove(produto);
            _context.SaveChanges();
            return produto;
        }
    }
}