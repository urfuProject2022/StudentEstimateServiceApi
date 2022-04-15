﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IWorkRepository
    {
        Task<Work> FindStudentWork(ObjectId studentId, ObjectId assignmentId);
    }
}
