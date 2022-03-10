using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Models
{
    public class User
    {
        public List<Guid> Rooms;
        public List<Guid> CreatedRooms;
        public Role Role;
    }
}
