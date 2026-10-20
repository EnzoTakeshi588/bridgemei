namespace EstoqueApi.Models;

public class MovimentarEstoque
{
    public int Id {get; set;}
    
    public int ProdutoId {get; set;}
    public Produto Produto {get; set;} = null!;
    
    public int UsuarioId {get; set;}
    
    public string Tipo {get; set;} = string.Empty;
    
    public int Quantidade {get; set;}
    
    public DateTime Data {get; set;} = DateTime.UtcNow;
    
    public int? VendaId {get; set;}
}