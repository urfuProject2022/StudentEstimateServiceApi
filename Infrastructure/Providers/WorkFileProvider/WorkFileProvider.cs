using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Infrastructure.Providers.WorkFileProvider
{
    public class WorkFileProvider : IWorkFileProvider
    {
        private readonly IGridFSBucket gridFsClient;
        private const string ContentType = "ContentType";
        private const string UnknownFileType = "Unknown";

        public WorkFileProvider(IMongoDatabaseSettings mongoSettings)
        {
            var mongoClient = new MongoClient(mongoSettings.ConnectionString);
            gridFsClient = new GridFSBucket(mongoClient.GetDatabase(mongoSettings.DatabaseName));
        }

        public async Task<List<ObjectId>> UploadFiles(IEnumerable<IFormFile> files)
        {
            var tasks = files.Select(UploadFile).ToArray();

            await Task.WhenAll(tasks);

            return tasks.Select(x => x.Result).ToList();
        }

        public async Task<ObjectId> UploadFile(IFormFile file)
        {
            var options = new GridFSUploadOptions();
            var metaData = new Dictionary<string, string>
            {
                { ContentType, file.ContentType }
            };
            options.Metadata = new BsonDocument(metaData);

            var fileId = ObjectId.GenerateNewId();

            var sourceReadStream = file.OpenReadStream();
            await gridFsClient.UploadFromStreamAsync(fileId, file.Name, sourceReadStream, options);
            sourceReadStream.Close();

            return fileId;
        }

        public List<FileDto> GetFilesWithMetaData(IEnumerable<ObjectId> filesId)
        {
            var filter = Builders<GridFSFileInfo<ObjectId>>.Filter.In(x => x.Id, filesId);
            var filesMetaData = gridFsClient.Find(filter).ToList();

            return filesMetaData.Select(GetFileInfo).ToList();
        }

        private FileDto GetFileInfo(GridFSFileInfo<ObjectId> fileInfo)
        {
            if (!fileInfo.Metadata.TryGetValue(ContentType, out var contentType))
                contentType = null;

            var bytes = gridFsClient.DownloadAsBytes(fileInfo.Id);

            return new FileDto
            {
                Content = bytes,
                Name = fileInfo.Filename,
                Type = contentType?.AsString ?? UnknownFileType
            };
        }
    }
}