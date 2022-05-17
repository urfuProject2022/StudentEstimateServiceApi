using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Infrastructure.Providers.WorkFileProvider
{
    public interface IWorkFileProvider
    {
        Task<List<ObjectId>> UploadFiles(IEnumerable<IFormFile> files);
        Task<ObjectId> UploadFile(IFormFile file);
        List<FileDto> GetFilesWithMetaData(IEnumerable<ObjectId> filesId);
    }
}