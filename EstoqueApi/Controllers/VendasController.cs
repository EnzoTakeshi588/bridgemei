using System.Security.Claims;
using EstoqueApi.DTOs;
using EstoqueApi.Services;
using EstoqueApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EstoqueApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class VendasController : ControllerBase
    {
        private readonly VendasService _vendasService;
        public VendasController(VendasService vendasService)
        {
            _vendasService = vendasService;
        }
        [HttpPost]

        public IActionResult Registrar([FromBody] List<ItemVendaRequest> itens)
        {
            var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(usuarioIdClaim, out var usuarioId))
            return Unauthorized();
            
            try
            {
                var venda = _vendasService.Registrar(itens, usuarioId);

                var resposta = new VendaResponse
                {
                    Id = venda.Id,
                    Data = venda.Data,
                    ValorTotal = venda.ValorTotal,
                    Itens = venda.Itens.Select(item => new ItemVendaResponse
                    {
                        ProdutoId = item.ProdutoId,
                        NomeProduto = item.NomeProduto,
                        Quantidade = item.Quantidade,
                        PrecoUnitario = item.PrecoUnitario,
                        Subtotal = item.Subtotal
                    }).ToList()
                };

            return StatusCode(StatusCodes.Status201Created, resposta);

            } catch(ArgumentException ex)
            {
                return BadRequest(new {message = ex.Message});
            } catch(KeyNotFoundException ex)
            {
                return NotFound(new {message = ex.Message});
            } catch(InvalidOperationException ex)
            {
                return Conflict(new {message = ex.Message});
            }
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(usuarioIdClaim, out var usuarioId))
                return Unauthorized();

            var vendas = _vendasService.ListarPorUsuario(usuarioId);

            return Ok(vendas);
        }
    }
}