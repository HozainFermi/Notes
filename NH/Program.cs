using Microsoft.EntityFrameworkCore;
using NH.Data;

namespace NH
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
           // builder.Services.AddSwaggerGen(); скачать нугет пакет свагера

            builder.Services.AddDbContext<NotesDBContext>(options => options.UseNpgsql(
                builder.Configuration.GetConnectionString("NotesDbConectionString")));


            var app = builder.Build();

           app.UseSwagger();
            app.UseSwaggerUI();
            app.MapControllers();

            app.UseCors(policy=> policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

           //app.MapGet("/", (context) =>context.Response.SendFileAsync("wwwroot/html/index.html") );

            app.Run();
        }
    }
}