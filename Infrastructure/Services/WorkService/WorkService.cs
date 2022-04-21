using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Infrastructure.Providers.WorkFileProvider;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services.WorkService
{
    public class WorkService : IWorkService
    {
        private readonly IWorkFileProvider workFileProvider;
        private readonly IAssignmentRepository assignmentRepository;
        private readonly IWorkRepository workRepository;
        private readonly IRoomRepository roomRepository;

        public WorkService(IWorkFileProvider workFileProvider,
            IAssignmentRepository assignmentRepository,
            IWorkRepository workRepository,
            IRoomRepository roomRepository)
        {
            this.workFileProvider = workFileProvider;
            this.assignmentRepository = assignmentRepository;
            this.workRepository = workRepository;
            this.roomRepository = roomRepository;
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
                SettedMarks = new List<ObjectId>()
            };
        }

        private static bool IsAssignmentExpired(DateTime assignmentExpirationTime)
        {
            return DateTime.Now.ToUniversalTime() > assignmentExpirationTime.ToUniversalTime();
        }
    }
}