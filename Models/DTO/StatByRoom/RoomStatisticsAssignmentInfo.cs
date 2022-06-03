using System;
using Newtonsoft.Json;

namespace StudentEstimateServiceApi.Models.DTO.StatByRoom
{
    public class RoomStatisticsAssignmentInfo
    {
        public string AssignmentId { get; set; }
        public bool IsWorkSubmit { get; set; }
        
        public string Title { get; set; }
        public DateTime ExpirationTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public double? AverageGrade { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? ReceivedMarksCount { get; set; }
    }
}
