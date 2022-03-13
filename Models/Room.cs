using System;
using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models
{
    public class Room
    {
        public List<Guid> Assignments;
        public string Name;
        public List<Guid> Users;
        public string OwnerId;
    }
}