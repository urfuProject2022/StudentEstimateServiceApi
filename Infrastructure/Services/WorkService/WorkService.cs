using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Infrastructure.WorkFileProvider;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services.WorkService
{
    public class WorkService : IWorkService
    {
        private readonly IWorkFileProvider workFileProvider;
        private readonly IAssignmentRepository assignmentRepository;
        private readonly WorkRepository workRepository;

        public WorkService(IWorkFileProvider workFileProvider, IAssignmentRepository assignmentRepository, WorkRepository workRepository)
        {
            this.workFileProvider = workFileProvider;
            this.assignmentRepository = assignmentRepository;
            this.workRepository = workRepository;
        }

        public async Task<OperationResult> Submit(SubmitWork submitWork, ObjectId studentId)
        {
            var assignmentOperationResult =await assignmentRepository.FindById(submitWork.AssignmentId);

            if (assignmentOperationResult.IsError)
                return assignmentOperationResult;

            var assignment = assignmentOperationResult.Result;
            
            if (IsAssignmentExpired(assignment.ExpirationTime))
                return OperationResult.Fail("Assignment expired");

            if (await IsWorkExists(studentId, submitWork.AssignmentId))
                return OperationResult.Fail("Work already exists", 403);

            var fileAnswersId = await workFileProvider.UploadFiles(submitWork.FileAnswers);

            var work = CreateWork(submitWork, fileAnswersId, studentId);

            assignment.Works.Add(work.Id);
            await assignmentRepository.Update(assignment);

            await workRepository.Create(work);

            return OperationResult.Success();
        }

        private async Task<bool> IsWorkExists(ObjectId userId, ObjectId assignmentId)
        {
            return await workRepository.FindStudentWork(userId, assignmentId) !=null;
        }

        private static Work CreateWork(SubmitWork submitWork, List<ObjectId> fileAnswersId, ObjectId studentId)
        {
            return new Work
            {
                Assignment = submitWork.AssignmentId,
                Id = ObjectId.GenerateNewId(),
                FileAnswers = fileAnswersId,
                StudentId = studentId,
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
