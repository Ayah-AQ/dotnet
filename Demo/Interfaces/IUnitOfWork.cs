namespace Demo.Interfaces
{
    public interface IUnitOfWork
    {
        IUserReposatory UserReposatory { get; }
        IMessageReposatory MessageReposatory { get; }
        ILikeReposatory LikeReposatory { get; }
        Task<bool> Complete();
        bool HasChanged();
    }
}
