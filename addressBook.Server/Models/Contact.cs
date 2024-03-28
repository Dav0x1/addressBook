using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace addressBook.Server.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [MinLength(8)]
        public string Password { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
        [JsonIgnore]
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
        [JsonIgnore]
        public int? SubcategoryId { get; set; }
        public Subcategory? Subcategory { get; set; }
    }
}