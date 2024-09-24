using Demo.Data;
using Demo.Helpers;
using Demo.Interfaces;
using Demo.Survices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Demo.Extintions
{
    public static class ApplicationSurviceExtintion
    {
        public static IServiceCollection AddAplicationSurvices(this IServiceCollection services,
            IConfiguration config)
        {

            services.AddControllers();
            

            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

            //services.AddCors();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader()
                               .WithExposedHeaders("Pagination");
                    });
            });

            services.AddScoped<ITokenSurvice,TokenService>();
            services.AddScoped<IphotoService,PhotoService>();
            services.AddScoped<ILikeReposatory,LikesReposatory>();
            services.AddScoped<IMessageReposatory,MessageReposatory>();

            services.AddScoped<LogUserActivity>();
            // Token Survice
            services.AddScoped<IUserReposatory, UserReposatory>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySetting"));


            return services;
        }
    }
}
