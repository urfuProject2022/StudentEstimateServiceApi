using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models
{
    public class GetWorksToGrade
    {
        public ObjectId Assignment { get; set; }
        public ObjectId Room { get; set; }
    }
}
