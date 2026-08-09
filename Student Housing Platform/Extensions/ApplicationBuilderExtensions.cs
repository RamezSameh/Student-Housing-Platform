using Microsoft.AspNetCore.Builder;
using Student_Housing_Platform.Middleware;

namespace Student_Housing_Platform.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
