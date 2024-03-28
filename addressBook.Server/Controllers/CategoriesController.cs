using addressBook.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace addressBook.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public CategoriesController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Return: Category List
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var categories = await _dbContext.Categories.ToArrayAsync();
                return Ok(categories);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}"); // Error: Could read categories from database
            }
        }
    }
}
