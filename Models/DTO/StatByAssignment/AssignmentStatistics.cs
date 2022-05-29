using System;
using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO.StatByAssignment
{
    public class AssignmentStatistics
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ExpirationTime { get; set; }
        public List<AssignmentStatUserRecord> Users { get; set; }
    }
}
