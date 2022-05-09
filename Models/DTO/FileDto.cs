namespace StudentEstimateServiceApi.Models.DTO
{
    public class FileDto
    {
        public byte[] Content { get; set; }
        public string Type { get; set; }

        public string Name { get; set; }
    }
}