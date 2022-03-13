using System;

namespace StudentEstimateServiceApi.Models
{
    public class Grade
    {
        public Guid Work;
        public Guid Assignment;
        public int Value;

        /// <summary>
        /// id пользователя который поставил оценку
        /// </summary>
        public Guid GradedByUser;

        /// <summary>
        /// id пользователя кому поставили оценку
        /// </summary>
        public Guid GradeReceiver;
    }
}