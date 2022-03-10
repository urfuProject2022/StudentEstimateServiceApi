using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Models
{
    public class Assignment
    {
        public string Tittle;
        public string Description;
        public List<Guid> Work;
        public DateTime ExpirationTime;
    }
}
