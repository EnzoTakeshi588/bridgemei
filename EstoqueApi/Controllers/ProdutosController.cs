using Microsoft.AspNetCore.Mvc;
using EstoqueApi.Services;
using EstoqueApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using EstoqueApi.Migrations;

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
            var UsuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (UsuarioIdClaim == null)
                return Unauthorized();

            var usuarioId = int.Parse(UsuarioIdClaim);

            return Ok(_service.Listar(usuarioId));
        }

        [HttpPost]
        public IActionResult Criar([FromBody] Produto produto)
        {
           try
           {
             var UsuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (UsuarioIdClaim == null)
                    return Unauthorized();

                var usuarioId = int.Parse(UsuarioIdClaim);

             return Ok(_service.Criar(produto, usuarioId));
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
                var UsuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (UsuarioIdClaim == null)
                    return Unauthorized();

                var usuarioId = int.Parse(UsuarioIdClaim);

                return Ok(_service.Entrada(id, quantidade, usuarioId));
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
                var UsuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (UsuarioIdClaim == null)
                    return Unauthorized();

                var usuarioId = int.Parse(UsuarioIdClaim);

                return Ok(_service.Excluir(id, usuarioId)); 
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
                var UsuarioIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (UsuarioIdClaim == null)
                    return Unauthorized();

               var usuarioId = int.Parse(UsuarioIdClaim);

                return Ok(_service.Saida(id, quantidade, usuarioId));
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