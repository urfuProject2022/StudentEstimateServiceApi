using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Models
{
    public class Room
    {
        public List<Guid> Assignments;
        public string Name;
        public List<Guid> Users;
        public Guid Owner;
    }
}
