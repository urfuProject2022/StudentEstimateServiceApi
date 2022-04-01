using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class AuthRepository : BaseRepository<UserAuth>
    {
        public AuthRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.AuthCollectionName)
        {

        }

        public async Task<UserAuth> FindFirst(Expression<Func<UserAuth, bool>> predicate)
        {
            var findResult =await collection.FindAsync(predicate).ConfigureAwait(false);
            return findResult.FirstOrDefault();
        }

        public async Task<bool> Any(Expression<Func<UserAuth, bool>> predicate)
        {
            var findResult = await collection.FindAsync(predicate).ConfigureAwait(false);
            return await findResult.AnyAsync();
        }
    }
}
