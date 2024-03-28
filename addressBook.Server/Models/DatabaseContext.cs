using Microsoft.EntityFrameworkCore;

namespace addressBook.Server.Models
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<Identity> Identities { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().HasData(
                new Category() { Id = 1, Name = "służbowy" },
                new Category() { Id = 2, Name = "prywatny" },
                new Category() { Id = 3, Name = "inny" }
            );

            modelBuilder.Entity<Subcategory>().HasData(
                new Subcategory() { Id = 1, Name = "Szef" },
                new Subcategory() { Id = 2, Name = "Klient" }
            );

            modelBuilder.Entity<Contact>()
                .HasOne(c => c.Category)
                .WithMany(c => c.Contacts)
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}