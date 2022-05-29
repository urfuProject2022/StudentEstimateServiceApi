using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Models.DTO.StatByAssignment;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services.StatisticsService
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IRoomRepository roomRepository;
        private readonly IUserRepository userRepository;
        private readonly IWorkRepository workRepository;
        private readonly IGradeRepository gradeRepository;
        private readonly IAssignmentRepository assignmentRepository;

        public StatisticsService(
            IRoomRepository roomRepository,
            IUserRepository userRepository,
            IWorkRepository workRepository,
            IGradeRepository gradeRepository,
            IAssignmentRepository assignmentRepository)
        {
            this.roomRepository = roomRepository;
            this.userRepository = userRepository;
            this.workRepository = workRepository;
            this.gradeRepository = gradeRepository;
            this.assignmentRepository = assignmentRepository;
        }
        public async Task GetStatisticByRoom()
        {

        }

        public async Task<OperationResult<AssignmentStatistics>> GetStatisticByAssignment(ObjectId assignmentId, ObjectId sessionUserId)
        {
            var roomResult = await FindRoomByAssignment(assignmentId);

            if (roomResult.IsError)
                return roomResult.ToOperationResult<AssignmentStatistics>();

            var room = roomResult.Result;

            if (room.OwnerId != sessionUserId)
                return OperationResult<AssignmentStatistics>.Fail("No access to room");

            var assignmentResult = await assignmentRepository.FindById(assignmentId);

            if (assignmentResult.IsError)
                return assignmentResult.ToOperationResult<AssignmentStatistics>();
            
            var usersInRoom = room.Users;

            var usersStat = new List<AssignmentStatUserRecord>();
            foreach (var userId in usersInRoom)
            {
                var userResult = await userRepository.FindById(userId);

                if (userResult.IsError)
                    continue;

                var user = userResult.Result;
                var record = new AssignmentStatUserRecord
                {
                    FullName = user.FullName,
                    UserId = userId
                };
                usersStat.Add(record);

                var userWork = await workRepository.FindStudentWork(userId, assignmentId);

                if (userWork == null)
                    continue;

                record.IsWorkSubmit = true;
                var receivedGrades =await gradeRepository.FindMany(userWork.ReceivedMarks);

                if (!receivedGrades.Any())
                    continue;

                var averageGrade = receivedGrades.Average(x=>x.Score);

                var gradeSettersId = receivedGrades.Select(x => x.GradedByUser);
                var gradeSettersResult = await userRepository.FindMany(gradeSettersId);
                var gradeSetters = gradeSettersResult.ToDictionary(x => x.Id);

                var gradeInfo = GetGradeInfo(receivedGrades, gradeSetters);

                record.AverageGrade = averageGrade;
                record.GradeSettersInfo = gradeInfo.ToList();
            }

            var assignment = assignmentResult.Result;

            var result = new AssignmentStatistics
            {
                Description = assignment.Description,
                Title = assignment.Title,
                Users = usersStat
            };

            return OperationResult<AssignmentStatistics>.Success(result);

        }

        private async Task<OperationResult<Room>> FindRoomByAssignment(ObjectId assignmentId)
        {
            var roomResult =await roomRepository.FindFirst(x=>x.Assignments.Contains(assignmentId));

            return roomResult != null ?
                OperationResult<Room>.Success(roomResult) :
                OperationResult<Room>.Fail("Room not found", (int)HttpStatusCode.NotFound);
        }

        private IEnumerable<AssignmentStatGradeRecord> GetGradeInfo(List<Grade> grades, Dictionary<ObjectId, User> gradeSetters)
        {
            foreach (var grade in grades)
            {
                if (!gradeSetters.TryGetValue(grade.GradedByUser, out var gradeSetter))
                    continue;

                yield return new AssignmentStatGradeRecord(gradeSetter.FullName, gradeSetter.Id,grade.Score);
            }
        }
    }
}
