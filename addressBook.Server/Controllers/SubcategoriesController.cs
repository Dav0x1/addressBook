using addressBook.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace addressBook.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SubcategoriesController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public SubcategoriesController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Return: Subcategory List
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var subcategories = await _dbContext.Subcategories.ToArrayAsync();
                return Ok(subcategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}"); // Error: Could read subcategories from database
            }
        }
    }
}