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
    }
}