using Demo.Data;
using Demo.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Demo.Extintions
{
    public static class IdentitySurviceExtintions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
            IConfiguration config)
        {

            services.AddIdentityCore<AppUser>(opt =>
               {
                   opt.Password.RequireNonAlphanumeric = false;
               })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddEntityFrameworkStores<DataContext>();



            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey not found");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"]; //HTTP headers in web socket send query string (access_token)
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrWhiteSpace(accessToken) && path.StartsWithSegments("/hubs")){
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });




            services.AddAuthorizationBuilder()
                .AddPolicy("RequireAdminRole", policy =>
                policy.RequireRole("Admin")
                )
            .AddPolicy("RequireModeratorRole", policy =>
                policy.RequireRole("Admin", "Moderator")
                );

            return services;
        }

    }
}
