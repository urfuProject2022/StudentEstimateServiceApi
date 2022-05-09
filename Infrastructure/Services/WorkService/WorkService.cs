using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Providers.WorkFileProvider;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services.WorkService
{
    public class WorkService : IWorkService
    {
        private readonly IWorkFileProvider workFileProvider;
        private readonly IAssignmentRepository assignmentRepository;
        private readonly IWorkRepository workRepository;
        private readonly IRoomRepository roomRepository;
        private readonly IStudentGradeInfoRepository studentGradeInfoRepository;
        private readonly IGradeRepository gradeRepository;

        public WorkService(IWorkFileProvider workFileProvider,
            IAssignmentRepository assignmentRepository,
            IWorkRepository workRepository,
            IRoomRepository roomRepository,
            IStudentGradeInfoRepository studentGradeInfoRepository,
            IGradeRepository gradeRepository)
        {
            this.workFileProvider = workFileProvider;
            this.assignmentRepository = assignmentRepository;
            this.workRepository = workRepository;
            this.roomRepository = roomRepository;
            this.studentGradeInfoRepository = studentGradeInfoRepository;
            this.gradeRepository = gradeRepository;
        }

        public async Task<OperationResult> Submit(SubmitWork submitWork, ObjectId userId)
        {
            var roomOperationResult = await roomRepository.FindById(submitWork.RoomId);
            if (roomOperationResult.IsError)
                return roomOperationResult;

            var room = roomOperationResult.Result;

            if (room.OwnerId == userId)
                return OperationResult.Fail("Admin can not submit work");

            if (!room.Users.Contains(userId))
                return OperationResult.Fail("Student not in room");

            var assignmentOperationResult = await assignmentRepository.FindById(submitWork.AssignmentId);

            if (assignmentOperationResult.IsError)
                return assignmentOperationResult;

            var assignment = assignmentOperationResult.Result;

            if (IsAssignmentExpired(assignment.ExpirationTime))
                return OperationResult.Fail("Assignment expired");

            if (await IsWorkExists(userId, submitWork.AssignmentId))
                return OperationResult.Fail("Work already exists");

            var fileAnswersId = await workFileProvider.UploadFiles(submitWork.FileAnswers);

            var work = CreateWork(submitWork, fileAnswersId, userId);

            assignment.Works.Add(work.Id);
            await assignmentRepository.Update(assignment);

            await workRepository.Create(work);

            return OperationResult.Success();
        }

        public async Task<OperationResult<BatchWorksToGradeDto>> GetWorksToGrade(GetWorksToGrade dto, ObjectId user)
        {
            var assignmentOperationResult = await assignmentRepository.FindById(dto.Assignment);

            if (assignmentOperationResult.IsError)
                return assignmentOperationResult.ToOperationResult<BatchWorksToGradeDto>();

            var assignment = assignmentOperationResult.Result;

            var validateResult = await ValidateGetWorksToGrade(assignment, dto.Room, user);

            if (validateResult.IsError)
                return validateResult.ToOperationResult<BatchWorksToGradeDto>();

            var studentGradeInfo = await studentGradeInfoRepository.FindFirst(x => x.UserId == user);

            if (studentGradeInfo == null)
            {
                var createGradeInfoOperationResult = await CreateNewGradeInfo(assignment, user);

                if (createGradeInfoOperationResult.IsError)
                    return OperationResult<BatchWorksToGradeDto>.Fail(createGradeInfoOperationResult.ErrorMessage);
                studentGradeInfo = createGradeInfoOperationResult.Result;
            }

            var gradedWorksCount = gradeRepository.GetGradesSettedByUser(user, dto.Assignment);
            var worksCountForGrade = studentGradeInfo.MaxWorkCountToGrade - gradedWorksCount;

            if (worksCountForGrade <= 0)
            {
                var emptyResult = new BatchWorksToGradeDto
                {
                    GradedWorksCount = gradedWorksCount,
                    NeedToGradeWorksCount = studentGradeInfo.MaxWorkCountToGrade
                };
                return OperationResult<BatchWorksToGradeDto>.Success(emptyResult);
            }

            var worksToGrade = await workRepository.FindWorkForGrade(assignment.Id, user, (int)worksCountForGrade);
            var result = new BatchWorksToGradeDto
            {
                GradedWorksCount = gradedWorksCount,
                NeedToGradeWorksCount = studentGradeInfo.MaxWorkCountToGrade
            };

            foreach (var work in worksToGrade)
            {
                var filesWithType = workFileProvider.GetFilesWithMetaData(work.FileAnswers);
                result.AvailableWorksToGrade.Add(new WorkDto
                {
                    FileAnswers = filesWithType,
                    TextAnswer = work.TextAnswer,
                    WorkId = work.Id
                });
            }

            return OperationResult<BatchWorksToGradeDto>.Success(result);
        }

        public async Task<OperationResult<WorkDto>> GetUserWork(ObjectId assignment, ObjectId user)
        {
            var userWorks = await workRepository.FindStudentWork(user, assignment);

            if (userWorks == null)
                return OperationResult<WorkDto>.Fail("Work not found", (int)HttpStatusCode.NotFound);

            var workFiles = workFileProvider.GetFilesWithMetaData(userWorks.FileAnswers);
            var workDto = new WorkDto
            {
                FileAnswers = workFiles,
                TextAnswer = userWorks.TextAnswer,
                WorkId = userWorks.Id
            };

            return OperationResult<WorkDto>.Success(workDto);
        }

        private async Task<OperationResult<StudentGradeInfo>> CreateNewGradeInfo(Assignment assignment, ObjectId user)
        {
            var workCountOperationResult = GetWorkCountToGrade(GradePriority.Normal, assignment.MinGradeCountForWork,
                assignment.MaxGradeCountForWork);

            if (workCountOperationResult.IsError)
                return OperationResult<StudentGradeInfo>.Fail(workCountOperationResult.ErrorMessage);

            var workCountToGrade = workCountOperationResult.Result;
            var studentGradeInfo = new StudentGradeInfo
            {
                AssignmentId = assignment.Id,
                Id = ObjectId.GenerateNewId(),
                MaxWorkCountToGrade = workCountToGrade,
                UserId = user
            };

            await studentGradeInfoRepository.Create(studentGradeInfo);
            return OperationResult<StudentGradeInfo>.Success(studentGradeInfo);
        }

        private async Task<bool> IsWorkExists(ObjectId userId, ObjectId assignmentId)
        {
            return await workRepository.FindStudentWork(userId, assignmentId) != null;
        }

        private static Work CreateWork(SubmitWork submitWork, List<ObjectId> fileAnswersId, ObjectId userId)
        {
            return new Work
            {
                Assignment = submitWork.AssignmentId,
                Id = ObjectId.GenerateNewId(),
                FileAnswers = fileAnswersId,
                UserId = userId,
                ReceivedMarks = new List<ObjectId>(),
                TextAnswer = submitWork.TextAnswer
            };
        }

        private static bool IsAssignmentExpired(DateTime assignmentExpirationTime)
        {
            return DateTime.Now.ToUniversalTime() > assignmentExpirationTime.ToUniversalTime();
        }

        private OperationResult<int> GetWorkCountToGrade(GradePriority priority, int minWorkGrades, int maxWorkGrades)
        {
            return priority switch
            {
                GradePriority.Low => OperationResult<int>.Success(minWorkGrades),
                GradePriority.Normal => OperationResult<int>.Success(
                    (int)Math.Ceiling((maxWorkGrades * 1.0 + minWorkGrades) / 2)),
                GradePriority.High => OperationResult<int>.Success(maxWorkGrades),
                _ => OperationResult<int>.Fail($"Unknown value of type {nameof(GradePriority)}")
            };
        }

        private async Task<OperationResult> ValidateGetWorksToGrade(Assignment assignment, ObjectId roomId, ObjectId user)
        {
            if (IsAssignmentExpired(assignment.ExpirationTime))
                return OperationResult.Fail("Assignment expired");

            var findRoomResult = await roomRepository.FindById(roomId);

            if (findRoomResult.IsError)
                return findRoomResult;

            var room = findRoomResult.Result;

            if (!room.Assignments.Contains(assignment.Id))
                return OperationResult.Fail("Assignment not found in room", 404);

            if (room.OwnerId == user)
                return OperationResult.Fail("Admin can not grade works");

            if (!room.Users.Contains(user))
                return OperationResult.Fail("User not in room");

            var isUserSubmitWork = await workRepository.FindStudentWork(user, assignment.Id) != null;
            if (!isUserSubmitWork)
                return OperationResult.Fail("User should submit work");

            return OperationResult.Success();
        }
    }
}