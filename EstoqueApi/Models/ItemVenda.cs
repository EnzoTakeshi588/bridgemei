namespace EstoqueApi.Models;

public class ItemVenda
{
    public int Id {get; set;}
    public int VendaId {get; set;}
    public Venda Venda {get; set;} = null!;
    public int? ProdutoId {get; set;}
    public int? ProdutoIdHistorico {get; set;}
    public Produto? Produto {get; set;}
    public string NomeProduto {get; set;} = string.Empty;    
    public int Quantidade {get; set;}
    public decimal PrecoUnitario {get; set;}
    public decimal Subtotal {get; set;}
}