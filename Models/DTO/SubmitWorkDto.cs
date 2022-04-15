using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class SubmitWorkDto
    {
        public string AssignmentId { get; set; }
        public string RoomId { get; set; }
        public string TextAnswer { get; set; }
        public IFormFile[] FileAnswers { get; set; }
    }
}
