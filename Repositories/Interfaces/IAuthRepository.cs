using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
	public interface IAuthRepository : IBaseRepository<UserAuth>
	{
		Task<UserAuth> FindFirst(Expression<Func<UserAuth, bool>> predicate);
		Task<bool> Any(Expression<Func<UserAuth, bool>> predicate);
	}
}