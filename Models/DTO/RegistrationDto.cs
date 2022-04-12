namespace StudentEstimateServiceApi.Models.DTO
{
    public class RegistrationDto
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public string FullName { get; set; }
    }
}