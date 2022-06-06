using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models.DTO.StatByAssignment
{
    public record AssignmentStatGradeRecord(string GradeSetterFullName, ObjectId GradeSetterId, int Grade,
        string comment);
}