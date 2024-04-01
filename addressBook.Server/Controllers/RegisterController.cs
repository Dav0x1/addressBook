using Microsoft.AspNetCore.Mvc;
using addressBook.Server.Models;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

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
                return BadRequest("Data validation error");
            }

            // Checking if user with this login already exist
            var existingUser = await _context.Identities.FirstOrDefaultAsync(u => u.login == user.login);
            if (existingUser != null)
            {
                return BadRequest("User with this login already exists");
            }

            // Adding user
            var newUser = new Identity();
            newUser.login = user.login;
            newUser.password = user.password;

            _context.Identities.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(JsonConvert.SerializeObject("User created successfully"));
        }
    }
}