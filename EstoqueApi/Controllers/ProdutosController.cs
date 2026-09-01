using Microsoft.AspNetCore.Mvc;
using EstoqueApi.Services;
using EstoqueApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace EstoqueApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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
           try
           {
             return Ok(_service.Criar(produto));
           }
           catch (ArgumentException e)
           {
            return BadRequest(e.Message);
           }
        }

        [HttpPost("entrada")]
        public IActionResult Entrada(int id, int quantidade)
        {
            try
            {
                return Ok(_service.Entrada(id, quantidade));
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Excluir(int id)
        {
            try 
            { 
                return Ok(_service.Excluir(id)); 
            }
            catch (KeyNotFoundException e) 
            { 
                return NotFound(e.Message);
            }
        } 

        [HttpPost("saida")]
        public IActionResult Saida(int id, int quantidade)
        {
            try
            {
                return Ok(_service.Saida(id, quantidade));
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(e.Message);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}