using Microsoft.EntityFrameworkCore;
using EstoqueApi.Models;

namespace EstoqueApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Produto> Produtos { get; set; }

        public DbSet<Venda> Vendas { get; set; }

        public DbSet<ItemVenda> ItensVenda { get; set; }

        public DbSet<MovimentarEstoque> MovimentarEstoque { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Venda -> Itens
            modelBuilder.Entity<Venda>()
                .HasMany(v => v.Itens)
                .WithOne(i => i.Venda)
                .HasForeignKey(i => i.VendaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Produto -> Itens da venda
            modelBuilder.Entity<ItemVenda>()
                .HasOne(i => i.Produto)
                .WithMany()
                .HasForeignKey(i => i.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Valores monetários
            modelBuilder.Entity<Venda>()
                .Property(v => v.ValorTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<ItemVenda>()
                .Property(i => i.PrecoUnitario)
                .HasPrecision(18, 2);

            modelBuilder.Entity<ItemVenda>()
                .Property(i => i.Subtotal)
                .HasPrecision(18, 2);

            // Produto -> Movimentações
            modelBuilder.Entity<MovimentarEstoque>()
                .HasOne(m => m.Produto)
                .WithMany()
                .HasForeignKey(m => m.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Venda -> Movimentações (vínculo opcional)
            modelBuilder.Entity<MovimentarEstoque>()
                .HasOne<Venda>()
                .WithMany()
                .HasForeignKey(m => m.VendaId)
                .OnDelete(DeleteBehavior.Restrict);
        
        }
    }
}