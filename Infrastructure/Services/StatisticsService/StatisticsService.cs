using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO.StatByAssignment;
using StudentEstimateServiceApi.Models.DTO.StatByRoom;
using StudentEstimateServiceApi.Models.DTO.StatByWork;
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

        public async Task<OperationResult<RoomStatistics>> GetStatisticByRoom(ObjectId roomId, ObjectId sessionUserId)
        {
            var roomResult = await roomRepository.FindById(roomId);

            if (roomResult.IsError)
                return roomResult.ToOperationResult<RoomStatistics>();

            var room = roomResult.Result;

            if (room.OwnerId != sessionUserId)
                return OperationResult<RoomStatistics>.Fail("No access to room");

            var usersInfo = new List<RoomStatisticsUserInfo>();
            foreach (var user in room.Users)
            {
                var statByUserAssignmentsResult = await GetStatByUserAssignments(user, room.Assignments);
                if (statByUserAssignmentsResult.IsError)
                    return statByUserAssignmentsResult.ToOperationResult<RoomStatistics>();

                usersInfo.Add(statByUserAssignmentsResult.Result);
            }

            var statResult = new RoomStatistics
            {
                RoomId = roomId.ToString(),
                RoomName = room.Name,
                UsersInfo = usersInfo
            };

            return OperationResult<RoomStatistics>.Success(statResult);
        }

        public async Task<OperationResult<AssignmentStatistics>> GetStatisticByAssignment(ObjectId assignmentId,
            ObjectId sessionUserId)
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
                var receivedGrades = await gradeRepository.FindMany(userWork.ReceivedMarks);

                if (!receivedGrades.Any())
                    continue;

                var averageGrade = receivedGrades.Average(x => x.Score);

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
                ExpirationTime = assignment.ExpirationTime,
                Title = assignment.Title,
                Users = usersStat
            };

            return OperationResult<AssignmentStatistics>.Success(result);
        }

        public async Task<OperationResult<WorkStatistics>> GetStatisticsByWork(ObjectId workId, ObjectId sessionUserId)
        {
            var userResult = await userRepository.FindById(sessionUserId);

            if (userResult.IsError)
                return userResult.ToOperationResult<WorkStatistics>();

            var user = userResult.Result;
            var workResult = await workRepository.FindById(workId);

            if (workResult.IsError)
                return workResult.ToOperationResult<WorkStatistics>();

            var userWork = workResult.Result;

            if (user.Id != userWork.UserId)
                return OperationResult<WorkStatistics>.Fail("No access to this work", 403);

            var averageGradeResult = await FindAverageGrade(userWork.ReceivedMarks);

            var workStatistics = new WorkStatistics()
            {
                Grade = averageGradeResult.Result,
                GradedByCount = userWork.ReceivedMarks.Count,
            };

            return OperationResult<WorkStatistics>.Success(workStatistics);
        }

        private async Task<OperationResult<Room>> FindRoomByAssignment(ObjectId assignmentId)
        {
            var roomResult = await roomRepository.FindFirst(x => x.Assignments.Contains(assignmentId));

            return roomResult != null
                ? OperationResult<Room>.Success(roomResult)
                : OperationResult<Room>.Fail("Room not found", (int)HttpStatusCode.NotFound);
        }

        private IEnumerable<AssignmentStatGradeRecord> GetGradeInfo(List<Grade> grades,
            Dictionary<ObjectId, User> gradeSetters)
        {
            foreach (var grade in grades)
            {
                if (!gradeSetters.TryGetValue(grade.GradedByUser, out var gradeSetter))
                    continue;

                yield return new AssignmentStatGradeRecord(gradeSetter.FullName, gradeSetter.Id, grade.Score,
                    grade.Comment);
            }
        }

        private async Task<OperationResult<RoomStatisticsUserInfo>> GetStatByUserAssignments(ObjectId userId,
            IEnumerable<ObjectId> assignments)
        {
            var assignmentInfos = new List<RoomStatisticsAssignmentInfo>();

            var userResult = await userRepository.FindById(userId);

            if (userResult.IsError)
                return userResult.ToOperationResult<RoomStatisticsUserInfo>();

            foreach (var assignmentId in assignments)
            {
                var userWork = await workRepository.FindStudentWork(userId, assignmentId);
                var assignmentResult = await assignmentRepository.FindById(assignmentId);

                if (assignmentResult.IsError)
                    continue;

                var assignment = assignmentResult.Result;

                var assignmentInfo = new RoomStatisticsAssignmentInfo
                {
                    AssignmentId = assignmentId.ToString(),
                    ExpirationTime = assignment.ExpirationTime,
                    Title = assignment.Title
                };
                assignmentInfos.Add(assignmentInfo);
                if (userWork == null)
                    continue;

                assignmentInfo.IsWorkSubmit = true;

                assignmentInfo.ReceivedMarksCount = userWork.ReceivedMarks.Count;

                if (!userWork.ReceivedMarks.Any())
                    continue;

                var averageGradeResult = await FindAverageGrade(userWork.ReceivedMarks);
                assignmentInfo.AverageGrade = averageGradeResult.Result;
            }

            var user = userResult.Result;
            var userInfo = new RoomStatisticsUserInfo
            {
                Fio = user.FullName,
                UserId = userId.ToString(),
                AssignmentInfo = assignmentInfos
            };
            return OperationResult<RoomStatisticsUserInfo>.Success(userInfo);
        }

        private async Task<OperationResult<double>> FindAverageGrade(IEnumerable<ObjectId> gradesId)
        {
            var grades = await gradeRepository.FindMany(gradesId);

            return grades.Count == 0
                ? OperationResult<double>.Success(0)
                : OperationResult<double>.Success(grades.Average(x => x.Score));
        }
    }
}