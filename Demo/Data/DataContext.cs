
using Microsoft.EntityFrameworkCore;
using Demo.Entities;
using Demo.Extintions;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Demo.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
    IdentityUserToken<int>>(options)
{
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();


        builder.Entity<UserLike>()
            .HasKey(k => new { k.SourceUserId, k.TargetUserId });



        builder.Entity<UserLike>()
            .HasOne(k => k.SourceUser)
            .WithMany(l => l.Liked)
            .HasForeignKey(s=>s.SourceUserId)
            .OnDelete(DeleteBehavior.NoAction);



         builder.Entity<UserLike>()
            .HasOne(k => k.TargetUser)
            .WithMany(l => l.LikedBy)
            .HasForeignKey(s=>s.TargetUserId)
            .OnDelete(DeleteBehavior.NoAction);



        builder.Entity<Message>()
            .HasOne(k => k.Receiver)
            .WithMany(l => l.MessagesRecievied)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(k => k.Sender)
            .WithMany(l => l.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

    }



    }

