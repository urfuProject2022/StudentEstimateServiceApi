using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models
{
    public class Assignment
    {
        public string Tittle;
        public string Description;
        public List<ObjectId> Work;
        public DateTime ExpirationTime;
    }
}