using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class AssignmentRepository : BaseRepository<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(IMongoDatabaseSettings dbSettings) :
            base(dbSettings, dbSettings.AssignmentCollectionName)
        {
        }

        public async Task<IEnumerable<Assignment>> FindRoomAssignments(IEnumerable<ObjectId> assignmentIds)
        {
            return await Collection.Find(a => assignmentIds.Contains(a.Id)).ToListAsync();
        }

        public Task Update(Assignment assignment)
        {
            return Collection.ReplaceOneAsync(x => x.Id == assignment.Id, assignment);
        }
    }
}