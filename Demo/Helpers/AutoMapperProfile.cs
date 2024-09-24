using AutoMapper;
using Demo.Dtos;
using Demo.DTOs;
using Demo.Entities;
using Demo.Extintions;

namespace Demo.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            CreateMap<AppUser, MemberDto>()
                .ForMember(d => d.Age, o => o.MapFrom(s => s.DateOFBirth.CalculateAge())                )
                .ForMember(d => d.PhotoUrl, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(d => d.SenderPhotoUrl, o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(x=>x.IsMain)!.Url))
                .ForMember(d => d.ReceiverPhotoUrl, o => o.MapFrom(s => s.Receiver.Photos.FirstOrDefault(x => x.IsMain)!.Url));
            CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));



        }
    }
}
