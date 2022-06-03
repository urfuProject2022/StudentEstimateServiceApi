using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO.StatByRoom
{
    public class RoomStatisticsUserInfo
    {
        public string UserId { get; set; }
        public string Fio { get; set; }

        public List<RoomStatisticsAssignmentInfo> AssignmentInfo { get; set; } = new();
    }
}
