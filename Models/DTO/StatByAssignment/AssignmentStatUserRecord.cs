using System.Collections.Generic;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models.DTO.StatByAssignment
{
    public class AssignmentStatUserRecord
    {
        public string FullName { get; set; }
        public ObjectId UserId { get; set; }
        public bool IsWorkSubmit { get; set; }
        public List<AssignmentStatGradeRecord> GradeSettersInfo { get; set; } = new();
        public double? AverageGrade { get; set; }
    }
}
