using System.Collections.Generic;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class WorksToGradeDto
    {
        public ObjectId WorkId { get; set; }
        public string TextAnswer { get; set; }
        public List<(byte[], string type)> FileAnswers { get; set; }

    }
}
