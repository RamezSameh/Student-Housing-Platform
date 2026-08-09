using FluentValidation;
using Student_Housing_Platform.Dtos.BookingDtos;

namespace Student_Housing_Platform.Validators
{
    public class CreateHousingBookingDtoValidator : AbstractValidator<CreateHousingBookingDto>
    {
        public CreateHousingBookingDtoValidator()
        {
            RuleFor(x => x.HousingRoomId).GreaterThan(0);
            RuleFor(x => x.CheckIn).LessThan(x => x.CheckOut).WithMessage("CheckIn must be before CheckOut");
        }
    }
}
