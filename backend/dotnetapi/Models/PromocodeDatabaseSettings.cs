namespace dotnetapi.Models
{
    public class PromocodeDatabaseSettings: IPromocodeDatabaseSettings
    {
        public string PromocodesCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IPromocodeDatabaseSettings
    {
        string PromocodesCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}