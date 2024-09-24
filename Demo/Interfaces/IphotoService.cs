using CloudinaryDotNet.Actions;

namespace Demo.Interfaces
{
    public interface IphotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
