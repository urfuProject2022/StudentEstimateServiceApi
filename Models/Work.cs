using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Models
{
    public class Work
    {
        public string StudentFio;
        public Guid Assignment;


        //public double AverageGrade; ??? можно считать на лету
        //public object? Answer;???

        /// <summary>
        /// Поставленные студентом оценки
        /// </summary>
        public List<Guid> SettedMarks;

        /// <summary>
        /// Полученные оценки
        /// </summary>
        public List<Guid> ReceivedMarks;
    }
}
