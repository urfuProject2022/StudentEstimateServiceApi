using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class StudentGradeInfoRepository : BaseRepository<StudentGradeInfo>, IStudentGradeInfoRepository
    {
        public StudentGradeInfoRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.GradeInfoCollectionName)
        {
        }
    }
}
