using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MongoDB.Driver;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class AuthRepository : BaseRepository<UserAuth>, IAuthRepository
    {
        public AuthRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.AuthCollectionName)
        {
        }

        public async Task<bool> Any(Expression<Func<UserAuth, bool>> predicate)
        {
            var findResult = await Collection.Find(predicate).SingleOrDefaultAsync();
            return findResult != null;
        }
    }
}