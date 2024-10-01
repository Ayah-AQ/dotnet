using Demo.Interfaces;

namespace Demo.Data
{
    public class UnitOfWork(DataContext context, IUserReposatory userReposatory, IMessageReposatory messageReposatory
        ,ILikeReposatory likeReposatory) : IUnitOfWork
    {
        public IUserReposatory UserReposatory => userReposatory;

        public IMessageReposatory MessageReposatory => messageReposatory;

        public ILikeReposatory LikeReposatory => likeReposatory;

        public async Task<bool> Complete()
        {
           
            var result = await context.SaveChangesAsync(); 
            return result > 0;
        }


        public bool HasChanged()
        {
            var result =  context.ChangeTracker.HasChanges();
            return result;
        }
    }
}
