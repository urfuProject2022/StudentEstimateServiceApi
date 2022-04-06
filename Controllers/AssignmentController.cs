using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Controllers
{
	[Route(Route.Base + "/assignments")]
	[ApiController]
	[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
	public class AssignmentController : Controller
	{
		private readonly IAssignmentRepository assignmentRepository;
		
		public AssignmentController(IAssignmentRepository assignmentRepository)
		{
			this.assignmentRepository = assignmentRepository;
		}
	}
}