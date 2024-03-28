using addressBook.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace addressBook.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _db;

        public LoginController(IConfiguration configuration, DatabaseContext db)
        {
            _configuration = configuration;
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Identity identity)
        {
            var user = await _db.Identities.FirstOrDefaultAsync(i => i.login == identity.login);

            if (user != null && user.password == identity.password)
            {
                var token = GenerateJwtToken(identity.login);
                return Ok(new { Token = token });
            }

            return Unauthorized();
        }

        private string GenerateJwtToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = "https://localhost:4200", // Replace static value with dynamic
                Issuer = "http://localhost:5011"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
