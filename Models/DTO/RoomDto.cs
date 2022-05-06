using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class RoomDto
    {
        public string Id { get; set; }
        public List<string> Assignments { get; set; }
        public string Name { get; set; }
        public string OwnerName { get; set; }
        public string Description { get; set; }
        public List<string> Users { get; set; }
        public string InviteLink { get; set; }
    }
}