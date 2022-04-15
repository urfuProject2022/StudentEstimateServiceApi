using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Infrastructure.WorkFileProvider
{
    public interface IWorkFileProvider
    {
        Task<List<ObjectId>> UploadFiles(IEnumerable<IFormFile> files);
        Task<ObjectId> UploadFile(IFormFile file);
    }
}
