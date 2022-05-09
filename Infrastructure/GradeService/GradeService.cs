using System;
using System.Threading.Tasks;
using AutoMapper;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Infrastructure.GradeService;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services
{
    public class GradeService : IGradeService
    {
        private readonly IGradeRepository gradeRepository;
        private readonly IWorkRepository workRepository;
        private readonly IAssignmentRepository assignmentRepository;
        private readonly IMapper mapper;

        public GradeService(IGradeRepository gradeRepository, IWorkRepository workRepository,
            IAssignmentRepository assignmentRepository, IMapper mapper)
        {
            this.gradeRepository = gradeRepository;
            this.workRepository = workRepository;
            this.assignmentRepository = assignmentRepository;
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

            var assignment = assignmentOperationResult.Result;

            if (IsAssignmentExpired(assignment.ExpirationTime))
                return OperationResult.Fail("Assignment expired");

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

        private static bool IsAssignmentExpired(DateTime assignmentExpirationTime)
        {
            return DateTime.Now.ToUniversalTime() > assignmentExpirationTime.ToUniversalTime();
        }
    }
}