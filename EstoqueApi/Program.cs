using EstoqueApi.Data;
using EstoqueApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=.\\SQLEXPRESS;Database=EstoqueDb;Trusted_Connection=True;TrustServerCertificate=True;")
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

app.Run(); // ← nada depois daqui