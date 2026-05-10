using Microsoft.AspNetCore.Mvc;
using EstoqueApi.Services;
using EstoqueApi.Models;

namespace EstoqueApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly EstoqueService _service;

        public ProdutosController(EstoqueService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(_service.Listar());
        }

        [HttpPost]
        public IActionResult Criar([FromBody] Produto produto)
        {
            return Ok(_service.Criar(produto.Nome));
        }

        [HttpPost("entrada")]
        public IActionResult Entrada(int id, int quantidade)
        {
            try
            {
                return Ok(_service.Entrada(id, quantidade));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Excluir(int id)
        {
            try { return Ok(_service.Excluir(id)); }
            catch (Exception e) { return BadRequest(e.Message);}
        } 

        [HttpPost("saida")]
        public IActionResult Saida(int id, int quantidade)
        {
            try
            {
                return Ok(_service.Saida(id, quantidade));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}