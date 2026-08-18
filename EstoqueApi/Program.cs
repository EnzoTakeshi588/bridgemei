using EstoqueApi.Data;
using EstoqueApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        cs,
        ServerVersion.AutoDetect(cs)
    )
);

builder.Services.AddScoped<EstoqueService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(options => {
    options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
});

app.UseAuthorization();
app.MapControllers();

app.Run();