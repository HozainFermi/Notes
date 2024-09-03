using Microsoft.EntityFrameworkCore;
using NH.Models.Entities;

namespace NH.Data
{
    public class NotesDBContext : DbContext
    {
        public NotesDBContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Note> Notes { get; set; }
    }
}
