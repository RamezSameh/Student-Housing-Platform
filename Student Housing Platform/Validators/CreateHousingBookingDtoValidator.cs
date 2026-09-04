using FluentValidation;
using Student_Housing_Platform.Dtos.BookingDtos;

namespace Student_Housing_Platform.Validators
{
    public class CreateHousingBookingDtoValidator : AbstractValidator<CreateHousingBookingDto>
    {
        public CreateHousingBookingDtoValidator()
        {
            RuleFor(x => x.HousingRoomId).GreaterThan(0);
            RuleFor(x => x.CheckIn).GreaterThan(DateTime.UtcNow.Date).WithMessage("Move-in date must be in the future.");
            RuleFor(x => x.DurationMonths).InclusiveBetween(1, 120);
            RuleFor(x => x.NationalId).NotEmpty().MaximumLength(50);
            RuleFor(x => x.UniversityId).NotEmpty().MaximumLength(50);
            RuleFor(x => x.StudentName).NotEmpty().MaximumLength(150);
            RuleFor(x => x.Mobile).NotEmpty().MaximumLength(30);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }
}
