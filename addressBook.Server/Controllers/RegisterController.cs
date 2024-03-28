using Microsoft.AspNetCore.Mvc;
using addressBook.Server.Models;
using Newtonsoft.Json;

namespace addressBook.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public RegisterController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Identity user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newUser = new Identity();
            newUser.login = user.login;
            newUser.password = user.password;


            _context.Identities.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(JsonConvert.SerializeObject("User created successfully"));
        }
    }
}