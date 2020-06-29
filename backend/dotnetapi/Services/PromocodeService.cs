using dotnetapi.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System;
using MongoDB.Bson;


namespace dotnetapi.Services
{
    public class PromocodeService
    {
        private readonly IMongoCollection<PromoCodes> _promocodes;

        public PromocodeService(IPromocodeDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _promocodes = database.GetCollection<PromoCodes>(settings.PromocodesCollectionName);
        }

        public List<PromoCodes> Get() =>
            _promocodes.Find(book => true).ToList();

        public PromoCodes Get(string id) =>
            _promocodes.Find<PromoCodes>(book => book.Id == id).FirstOrDefault();

        public PromoCodes Create(PromoCodes book)
        {
            _promocodes.InsertOne(book);
            return book;
        }

        public void Update(string id, PromoCodes bookIn) {
            var builder = Builders<PromoCodes>.Filter;
            var filter = builder.Where(item => item.Id == id);
            var updateBuilder = Builders<PromoCodes>.Update;
            updateBuilder.Set("PromoString", bookIn.PromoString);
            updateBuilder.Set("PromoAmount", bookIn.PromoAmount);
            var update = updateBuilder.Set("PromoValidTill", bookIn.PromoValidTill);
            _promocodes.UpdateOne(filter, update);
        }

        public void Remove(PromoCodes bookIn) =>
            _promocodes.DeleteOne(book => book.Id == bookIn.Id);

        public void Remove(string id) => 
            _promocodes.DeleteOne(book => book.Id == id);
    }
}