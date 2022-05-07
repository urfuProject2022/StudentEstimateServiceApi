using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver.GridFS;

namespace StudentEstimateServiceApi.Infrastructure.Providers.WorkFileProvider
{
    public interface IWorkFileProvider
    {
        Task<List<ObjectId>> UploadFiles(IEnumerable<IFormFile> files);
        Task<ObjectId> UploadFile(IFormFile file);
        List<(byte[], string)> GetFilesWithMetaData(IEnumerable<ObjectId> filesId);
    }
}