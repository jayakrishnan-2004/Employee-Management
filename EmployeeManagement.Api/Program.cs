
var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Enable React Frontend Connection
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("ReactPolicy");

app.MapControllers();

app.Run();
