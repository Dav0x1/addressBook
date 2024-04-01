using addressBook.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace addressBook.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public ContactsController( DatabaseContext database)
        {
            _dbContext = database;
        }

        /* Endpoint that return contacts
         * Parameters:
         * paginationPage - Id representing pagination page
         * paginationAmount - Amount of record that is return
         * Return: Contact List */
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int paginationPage = 1, [FromQuery] int paginationAmount = 10)
        {
            try
            {
                int totalPaginationPages = countTotalPaginationPages(paginationAmount);

                // Check if pagination page isn't out of range, otherwise return first pagination page
                if (paginationPage < 1 || paginationPage > totalPaginationPages)
                    paginationPage = 1;

                int skipAmount = (paginationPage - 1) * paginationAmount;

                var contacts = _dbContext.Contacts.Include(c => c.Category).Include(c => c.Subcategory)
                    .OrderBy(c => c.Id).Skip(skipAmount).Take(paginationAmount).ToArray();

                return Ok(contacts);
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(500, "Error while reading contacts");
            }
            
        }

        /* Endpoint that return count of pagination pages
         * Parameters:
         * paginationAmount - Amount of record that is return
         * Return: Total pagination pages */
        [HttpGet("paginationPages")]
        public IActionResult GetPaginationPages([FromQuery] int paginationAmount = 10)
        {
            int totalPaginationPages = countTotalPaginationPages(paginationAmount);
            return Ok(new { totalPaginationPages });
        }


        /* Endpoint for delete contact with given id
         * Parameters:
         * id - contact id to delete */
        [Authorize]
        [HttpDelete("delete")]
        public IActionResult DeleteContact([FromQuery] int id)
        {
            var contactToDelete = _dbContext.Contacts.FirstOrDefault(c => c.Id == id);
            if (contactToDelete == null)
            {
                return NotFound("Couldn't find contact with this id");
            }

            _dbContext.Contacts.Remove(contactToDelete);
            _dbContext.SaveChanges();

            return Ok(new { message = "Contact deleted" });;
        }

        /* Endpoint for adding a contact
         * Expects:
         * JSON Contact data */
        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddContact([FromBody] Contact contact)
        {
            try
            {
                // Contact validation
                if (!ModelState.IsValid)
                {
                    return BadRequest("Data validation error");
                }

                // Validate password complexity
                if (!IsStrongPassword(contact.Password))
                {
                    return BadRequest("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
                }

                // Check if there isn't contact with such email
                if (await _dbContext.Contacts.AnyAsync(c=>c.Email == contact.Email))
                {
                    return BadRequest("Email already in use");
                }

                // Check if category exists
                if (contact.Category == null)
                {
                    return BadRequest("Category isn't initialize");
                }

                // Check if ID matches the provided name of category
                var category = await _dbContext.Categories.FirstOrDefaultAsync(cat => cat.Name == contact.Category.Name);
                if (category == null)
                {
                    return BadRequest("Category doesn't exist");
                }
                if (category.Id != contact.Category.Id)
                {
                    return BadRequest("Category ID doesn't match to name");
                }
                contact.CategoryId = category.Id;
                contact.Category = category;

                // Check subcategory logic
                if (category.Name == "prywatny" && contact.Subcategory != null)
                {
                    contact.Subcategory = null;
                }
                
                if(( category.Name == "służbowy" || category.Name == "inny") && contact.Subcategory == null)
                {
                    return BadRequest("Subcateogry is required when category is set to business or other");
                }
                
                if(category.Name == "służbowy")
                {
                    var subcategory = await _dbContext.Subcategories.FirstOrDefaultAsync(cat => cat.Name == contact.Subcategory.Name);
                    if (subcategory == null)
                    {
                        return BadRequest("Subcategory doesn't exist");
                    }
                    contact.Subcategory = subcategory;
                    contact.SubcategoryId = subcategory.Id;
                }
                else if(category.Name == "inny")
                {
                    if (await _dbContext.Subcategories.AnyAsync(cat => cat.Name == contact.Subcategory.Name))
                    {
                        return BadRequest("Subcategory already exist");
                    }
                    contact.Subcategory.Id = 0;

                    await _dbContext.Subcategories.AddAsync(contact.Subcategory);
                }

                // Check if Id isn't set
                if (contact.Id != null)
                {
                    contact.Id = 0;
                }
                await _dbContext.Contacts.AddAsync(contact);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Contact has been added" });
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(500, "Error while adding contact");
            }
        }

        /* Endpoint for updating a contact
         * Expects:
         * JSON Contact data */
        [Authorize]
        [HttpPost("update")]
        public async Task<IActionResult> UpdateContact([FromBody] Contact contact)
        {
            try
            {
                // Contact validation
                if (!ModelState.IsValid)
                {
                    return BadRequest("Data validation error");
                }

                // Validate password complexity
                if (!IsStrongPassword(contact.Password))
                {
                    return BadRequest("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
                }

                // Check if there isn't contact with such email
                var existingContact = await _dbContext.Contacts.FirstOrDefaultAsync(c => c.Email == contact.Email);
                if (existingContact == null)
                {
                    return BadRequest("There isn't contact with this email to update");
                }

                // Check if category exists
                if (contact.Category == null)
                {
                    return BadRequest("Category isn't initialize");
                }

                // Check if ID matches the provided name of category
                var category = await _dbContext.Categories.FirstOrDefaultAsync(cat => cat.Name == contact.Category.Name);
                if (category == null)
                {
                    return BadRequest("Category doesn't exist");
                }
                if (category.Id != contact.Category.Id)
                {
                    return BadRequest("Category ID doesn't match to name");
                }
                contact.CategoryId = category.Id;
                contact.Category = category;

                // Check subcategory logic
                if (category.Name == "prywatny" && contact.Subcategory != null)
                {
                    contact.Subcategory = null;
                }

                if ((category.Name == "służbowy" || category.Name == "inny") && contact.Subcategory == null)
                {
                    return BadRequest("Subcateogry is required when category is set to business or other");
                }

                if (category.Name == "służbowy")
                {
                    var subcategory = await _dbContext.Subcategories.FirstOrDefaultAsync(cat => cat.Name == contact.Subcategory.Name);
                    if (subcategory == null)
                    {
                        return BadRequest("Subcategory doesn't exist");
                    }
                    contact.Subcategory = subcategory;
                    contact.SubcategoryId = subcategory.Id;
                }
                else if (category.Name == "inny")
                {
                    if (await _dbContext.Subcategories.AnyAsync(cat => cat.Name == contact.Subcategory.Name))
                    {
                        return BadRequest("Subcategory already exist");
                    }

                    contact.Subcategory.Id = 0;
                    await _dbContext.Subcategories.AddAsync(contact.Subcategory);
                }

                _dbContext.Entry(existingContact).CurrentValues.SetValues(contact);
                await _dbContext.SaveChangesAsync();

                return Ok(JsonConvert.SerializeObject("Contact has been updated"));
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return StatusCode(500, "Error while updating contact");
            }
        }

        // Calculate total amount of pagination pages
        private int countTotalPaginationPages(int pageSize)
        {
            int totalContacts = _dbContext.Contacts.Count();
            return (int)Math.Ceiling((double)totalContacts / pageSize);
        }

        // Checking password complexity
        private bool IsStrongPassword(string password)
        {
            if (password.Length < 8)
                return false;
            if (!password.Any(char.IsUpper))
                return false;
            if (!password.Any(char.IsLower))
                return false;
            if (!password.Any(char.IsDigit))
                return false;
            if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
                return false;
            return true;
        }
    }
}