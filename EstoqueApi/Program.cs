using EstoqueApi.Data;
using EstoqueApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ CORS aqui, antes do builder.Build()
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

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

// ✅ UseCors aqui, antes do MapControllers
app.UseCors();

app.MapControllers();

app.Run(); // ← nada depois daqui