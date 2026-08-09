namespace Student_Housing_Platform.Dtos.PaymentDtos
{
    public class PaymentConfirmationDto
    {
        [Required]
        public int BookingId { get; set; } // (تأكيد على أنهي حجز)

        [Required]
        public string TransactionId { get; set; } // (رقم العملية من Stripe)
    }
}
