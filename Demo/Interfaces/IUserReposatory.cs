using Demo.DTOs;
using Demo.Entities;
using Demo.Helpers;

namespace Demo.Interfaces;

    public interface IUserReposatory
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser?> GetUserByIdAsync(int id);
        Task<AppUser?> GetUserByUsernameAsync(string username);
        Task<pagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto?> GetMemberAsync(string username);
    
}
