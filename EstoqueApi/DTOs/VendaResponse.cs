namespace EstoqueApi.DTOs;

public class VendaResponse
{
    public int Id {get; set;}
    public DateTimeOffset Data {get; set;}
    public decimal ValorTotal {get; set;}

    public List<ItemVendaResponse> Itens {get; set;} = new();
}
public class ItemVendaResponse
{
    public int? ProdutoId { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal { get; set; }
}