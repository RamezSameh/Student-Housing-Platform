using Microsoft.Extensions.Caching.Memory;
using System.Net;

namespace Student_Housing_Platform.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly int _limit;
        private readonly TimeSpan _window;

        public RateLimitingMiddleware(RequestDelegate next, IMemoryCache cache, IConfiguration config)
        {
            _next = next;
            _cache = cache;
            _limit = config.GetValue<int>("RateLimit:RequestsPerWindow", 60);
            _window = TimeSpan.FromSeconds(config.GetValue<int>("RateLimit:WindowSeconds", 60));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "anonymous";
            var key = $"rl_{ip}";

            var entry = _cache.GetOrCreate(key, e =>
            {
                e.AbsoluteExpirationRelativeToNow = _window;
                return new RateLimitEntry { Count = 0 };
            });

            if (entry.Count >= _limit)
            {
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                await context.Response.WriteAsync("Too many requests. Try later.");
                return;
            }

            entry.Count++;
            _cache.Set(key, entry, _window);

            await _next(context);
        }

        private class RateLimitEntry
        {
            public int Count { get; set; }
        }
    }
}
