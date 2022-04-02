using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class UserDto
    {
        public string Id { get; set; }
        public List<string> Rooms { get; set; }
        public List<string> CreatedRooms { get; set; }
        public Role Role { get; set; }
        public string FullName { get; set; }
    }
}