namespace StudentEstimateServiceApi.Settings
{
    public interface IMongoDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
        string UserCollectionName { get; set; }
        string AuthCollectionName { get; set; }
    }
}