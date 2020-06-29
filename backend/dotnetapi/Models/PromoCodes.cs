using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace dotnetapi.Models {
    public class PromoCodes {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string PromoString { get; set; }
        public float PromoAmount { get; set; }
        public string PromoValidTill { get; set; }
    }
}