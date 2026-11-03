using EstoqueApi.Utils;

namespace EstoqueApi.Models;

public class Venda
{
    public int Id {get; set;}
     public DateTime Data { get; set; } = DataHoraBrasil.Agora();
    public decimal ValorTotal { get; set; }
    public int UsuarioId { get; set; }
    public List<ItemVenda> Itens { get; set; } = new();
}