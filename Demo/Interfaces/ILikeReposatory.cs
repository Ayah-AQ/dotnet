using Demo.DTOs;
using Demo.Extintions;
using Demo.Helpers;

namespace Demo.Interfaces
{
    public interface ILikeReposatory
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<pagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
        Task<IEnumerable<int>> GetCurrentUserLikeId(int currentUserId);
        void DeleteLike(UserLike like);
        void AddLike(UserLike like);
        //Task<bool> SaveChanges();
    }
}
