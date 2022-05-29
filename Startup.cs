using System;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using StudentEstimateServiceApi.Infrastructure.GradeService;
using StudentEstimateServiceApi.Infrastructure.Providers.WorkFileProvider;
using StudentEstimateServiceApi.Infrastructure.Services;
using StudentEstimateServiceApi.Infrastructure.Services.InviteService;
using StudentEstimateServiceApi.Infrastructure.Services.StatisticsService;
using StudentEstimateServiceApi.Infrastructure.Services.WorkService;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;
using MongoDatabaseSettings = StudentEstimateServiceApi.Settings.MongoDatabaseSettings;

namespace StudentEstimateServiceApi
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<MongoDatabaseSettings>(
                Configuration.GetSection(nameof(MongoDatabaseSettings)));

            services.AddSingleton<IMongoDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<MongoDatabaseSettings>>().Value);

            services.AddSingleton<IUserRepository, UserRepository>();
            services.AddSingleton<IRoomRepository, RoomRepository>();
            services.AddSingleton<IAuthRepository, AuthRepository>();
            services.AddSingleton<IInviteService, InviteService>();
            services.AddSingleton<IAssignmentRepository, AssignmentRepository>();
            services.AddSingleton<IWorkRepository, WorkRepository>();
            services.AddSingleton<IStudentGradeInfoRepository, StudentGradeInfoRepository>();
            services.AddSingleton<IGradeRepository, GradeRepository>();

            services.AddSingleton<IGradeService, GradeService>();
            services.AddSingleton<IWorkFileProvider, WorkFileProvider>();
            services.AddSingleton<IWorkService, WorkService>();
            services.AddSingleton<IStatisticsService, StatisticsService>();

            services.AddControllers();

            services.AddAutoMapper(cfg =>
            {
                cfg.CreateMap<User, UserDto>();
                cfg.CreateMap<UserDto, User>();
                cfg.CreateMap<Room, RoomDto>();
                cfg.CreateMap<RoomDto, Room>();
                cfg.CreateMap<RegistrationDto, UserAuth>();
                cfg.CreateMap<RegistrationDto, User>();
                cfg.CreateMap<AssignmentDto, Assignment>();
                cfg.CreateMap<Assignment, AssignmentDto>();
                cfg.CreateMap<SubmitWorkDto, SubmitWork>();
                cfg.CreateMap<GetWorksToGradeDto, GetWorksToGrade>();
                cfg.CreateMap<SetGradeDto, Grade>();
            }, Array.Empty<Assembly>());

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(
                options =>
                {
                    options.Cookie.Name = "auth";
                    options.Cookie.HttpOnly = false;
                });

            services.AddSpaStaticFiles(x => { x.RootPath = "wwwroot"; });

            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            if (!env.IsDevelopment())
                app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapWhen(context => context.Request.Path.StartsWithSegments("/api"),
                _ => { app.UseEndpoints(x => x.MapControllers()); });

            app.UseSpa(x =>
            {
                x.Options.SourcePath = @"front";

                if (!env.IsProduction())
                    x.UseReactDevelopmentServer("start");
            });
        }
    }
}