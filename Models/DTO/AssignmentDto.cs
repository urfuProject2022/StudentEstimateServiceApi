using System;
using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class AssignmentDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Works { get; set; }
        public DateTime ExpirationTime { get; set; }
    }
}