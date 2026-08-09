using FluentValidation;
using Student_Housing_Platform.Dtos.HousingDtos;

namespace Student_Housing_Platform.Validators
{
    public class CreateHousingDtoValidator : AbstractValidator<CreateHousingDto>
    {
        public CreateHousingDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Address).NotEmpty().MaximumLength(300);
            RuleFor(x => x.City).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Latitude).InclusiveBetween(-90.0, 90.0);
            RuleFor(x => x.Longitude).InclusiveBetween(-180.0, 180.0);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        }
    }
}
