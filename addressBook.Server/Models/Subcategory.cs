using System.Text.Json.Serialization;

namespace addressBook.Server.Models
{
    public class Subcategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public ICollection<Contact>? Contacts { get; } = new List<Contact>();
    }
}
