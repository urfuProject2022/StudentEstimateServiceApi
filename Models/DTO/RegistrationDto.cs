namespace StudentEstimateServiceApi.Models.DTO
{
    public class RegistrationDto
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public string FullName { get; set; }
    }
}
