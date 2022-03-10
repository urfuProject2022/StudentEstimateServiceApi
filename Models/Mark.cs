using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Models
{
    public class Mark
    {
        public Guid Work;
        public Guid Assignment;
        public int Value;

        /// <summary>
        /// id пользователя который поставил оценку
        /// </summary>
        public Guid MarkedByUser;

        /// <summary>
        /// id пользователя кому поставили оценку
        /// </summary>
        public Guid MarkReceiver;
    }
}
