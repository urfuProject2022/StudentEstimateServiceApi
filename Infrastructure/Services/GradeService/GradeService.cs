using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services.GradeService
{
    public class GradeService : IGradeService
    {
        private readonly IGradeRepository gradeRepository;
        private readonly IWorkRepository workRepository;
        private readonly IAssignmentRepository assignmentRepository;
        private readonly IRoomRepository roomRepository;
        private readonly IMapper mapper;

        public GradeService(
            IGradeRepository gradeRepository,
            IWorkRepository workRepository,
            IAssignmentRepository assignmentRepository,
            IRoomRepository roomRepository,
            IMapper mapper)
        {
            this.gradeRepository = gradeRepository;
            this.workRepository = workRepository;
            this.assignmentRepository = assignmentRepository;
            this.roomRepository = roomRepository;
            this.mapper = mapper;
        }

        public async Task<OperationResult> SetGrade(SetGradeDto dto, ObjectId user)
        {
            var grade = mapper.Map<Grade>(dto);
            grade.Id = ObjectId.GenerateNewId();

            if (grade.Score < Constants.MinGrade || grade.Score > Constants.MaxGrade)
                return OperationResult.Fail("Invalid grade");

            var userSetterWork = await workRepository.FindStudentWork(user, grade.AssignmentId);

            if (userSetterWork == null)
                return OperationResult.Fail("Work should be submitted before grading other works");

            var workForGradeOperationResult = await workRepository.FindById(dto.GradedWorkId);

            if (workForGradeOperationResult.IsError)
                return workForGradeOperationResult;

            var workForGrade = workForGradeOperationResult.Result;
            var assignmentOperationResult = await assignmentRepository.FindById(workForGrade.Assignment);

            if (assignmentOperationResult.IsError)
                return assignmentOperationResult;

            var hasAccess = await CheckAccessToRoomByAssignment(assignmentOperationResult.Result.Id, user);
            if (hasAccess.IsError)
                return hasAccess;

            var isGradeExists = gradeRepository.FindGrade(grade.GradedWorkId, user) != null;

            if (isGradeExists)
                return OperationResult.Fail("Grade already exists");

            grade.GradedByUser = user;
            await gradeRepository.Create(grade);

            workForGrade.ReceivedMarks.Add(grade.Id);
            workForGrade.GradedBy.Add(user);
            await workRepository.Update(workForGrade);

            return OperationResult.Success();
        }

        private async Task<OperationResult> CheckAccessToRoomByAssignment(ObjectId assignmentId, ObjectId userId)
        {
            var room = await roomRepository.FindFirst(x => x.Assignments.Contains(assignmentId));

            if (room == null)
                return OperationResult.Fail("Room not found", (int)HttpStatusCode.NotFound);

            if (!room.Users.Contains(userId) && room.OwnerId != userId)
                return OperationResult.Fail("No access to assignment");
            return OperationResult.Success();
        }
    }
}