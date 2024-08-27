
using Microsoft.EntityFrameworkCore;
using Demo.Entities;

namespace Demo.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }

}
