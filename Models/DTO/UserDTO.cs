using System;
using System.Collections.Generic;


namespace StudentEstimateServiceApi.Models.DTO
{
    public class UserDto
    {
        public string Id { get; set; }
        public List<Guid> Rooms { get; set; }
        public List<Guid> CreatedRooms { get; set; }
        public Role Role { get; set; }
        public string FullName { get; set; }
    }
}