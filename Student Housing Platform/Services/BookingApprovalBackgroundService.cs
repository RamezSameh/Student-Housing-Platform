using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.Services;

public sealed class BookingApprovalBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<BookingApprovalBackgroundService> _logger;

    public BookingApprovalBackgroundService(IServiceScopeFactory scopeFactory, ILogger<BookingApprovalBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var repository = scope.ServiceProvider.GetRequiredService<IBookingRepository>();
                await repository.ProcessApprovalDeadlinesAsync(DateTime.UtcNow, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
            catch (Exception ex) { _logger.LogError(ex, "Booking approval deadline processing failed."); }
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
