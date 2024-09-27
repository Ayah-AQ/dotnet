using AutoMapper;
using AutoMapper.QueryableExtensions;
using Demo.DTOs;
using Demo.Entities;
using Demo.Helpers;
using Demo.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Demo.Data
{
    public class UserReposatory(DataContext context, IMapper mapper) : IUserReposatory
    {

        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await context.Users
                 .Where(x => x.UserName == username)
                 .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                 .SingleOrDefaultAsync();
        }
        public async Task<pagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = context.Users.AsQueryable();

            query = query.Where(x => x.UserName != userParams.CurrentUserName);

            if (userParams.Gender != null)
            {
                query = query.Where(x => x.Gender == userParams.Gender);

            }


            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));


            query = query.Where(x => x.DateOFBirth >= minDob && x.DateOFBirth <= maxDob);

            if (userParams?.OrderBy != null)
            {
                query = userParams.OrderBy switch
                {
                    "created" => query.OrderByDescending(x => x.Created),
                    "lastActive" => query.OrderByDescending(x => x.LastActive),
                    _ => query.OrderByDescending(x => x.Created) 
                };
            }



            return await pagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            //return await context.Users.FindAsync(id);
            return await context.Users
             .Include(x => x.Photos)
             .SingleOrDefaultAsync(c => c.Id == id);
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            return await context.Users
                .Include(x=> x.Photos)
                .SingleOrDefaultAsync(c=>c.UserName == username);


        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users
                .Include(x=> x.Photos)
                .ToListAsync();

        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync()>0;

        }

        public void Update(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }

       
            
    }
}
