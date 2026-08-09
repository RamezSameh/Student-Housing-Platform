using FluentValidation;
using Student_Housing_Platform.Dtos.ReviewDtos;

namespace Student_Housing_Platform.Validators
{
    public class CreateHousingReviewDtoValidator : AbstractValidator<CreateHousingReviewDto>
    {
        public CreateHousingReviewDtoValidator()
        {
            RuleFor(x => x.HousingId).GreaterThan(0);
            RuleFor(x => x.Rating).InclusiveBetween(1, 5);
            RuleFor(x => x.Comment).MaximumLength(1500);
        }
    }
}
