using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO.StatByRoom
{
    public class RoomStatistics
    {
        public string RoomId { get; set; }
        public string RoomName { get; set; }
        public List<RoomStatisticsUserInfo> UsersInfo { get; set; }
    }
}
