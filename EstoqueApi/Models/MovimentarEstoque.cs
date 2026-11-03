using EstoqueApi.Utils;

namespace EstoqueApi.Models;

public class MovimentarEstoque
{
    public int Id {get; set;}
    public int? ProdutoId {get; set;}
    public int? ProdutoIdHistorico {get; set;}
    public Produto? Produto {get; set;}
    public string NomeProduto {get; set;} = string.Empty;    
    public int UsuarioId {get; set;}
    public string Tipo {get; set;} = string.Empty;
    public int Quantidade {get; set;}
    public DateTime Data {get; set;} = DataHoraBrasil.Agora();
    public int? VendaId {get; set;}
}