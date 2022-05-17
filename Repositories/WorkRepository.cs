using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class WorkRepository : BaseRepository<Work>, IWorkRepository
    {
        public WorkRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.WorkCollectionName)
        {
        }

        public Task<Work> FindStudentWork(ObjectId studentId, ObjectId assignmentId)
        {
            var filter = Builders<Work>.Filter.Where(x => x.UserId == studentId && x.Assignment == assignmentId);
            return Collection.Find(filter).SingleOrDefaultAsync();
        }

        public async Task<List<Work>> FindWorkForGrade(ObjectId assignment,ObjectId gradeSetter,int take = Constants.MaxGradeCountForWork)
        {
            var works = await Collection
                .Find(x => x.Assignment == assignment && x.UserId != gradeSetter && !x.GradedBy.Contains(gradeSetter))
                .ToListAsync();

            var worksWithOutGrades = works
                .Where(x => x.ReceivedMarks == null || x.ReceivedMarks.Count == 0)
                .Take(take);

            var worksWithGrades = works
                .Where(x=>x.ReceivedMarks !=null && x.ReceivedMarks.Count != 0)
                .OrderBy(x=>x.ReceivedMarks.Count)
                .Take(take);

            return worksWithOutGrades
                .Concat(worksWithGrades)
                .Take(take)
                .ToList();
        }

        public async Task Update(Work work)
        {
            await Collection.ReplaceOneAsync(x => x.Id == work.Id, work);
        }
    }
}