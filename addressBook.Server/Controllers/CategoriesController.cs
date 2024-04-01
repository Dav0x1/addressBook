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

        // Return category list
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
                Console.Write(ex.ToString());
                return StatusCode(500, "Error while reading categories");
            }
        }
    }
}
