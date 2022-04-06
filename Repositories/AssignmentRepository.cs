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
	}
}