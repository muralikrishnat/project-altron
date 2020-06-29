from flask_mongoengine import MongoEngine

db = MongoEngine()

def initialize_db(app):
    db.init_app(app)


class inventory(db.Document):
    name = db.StringField(required=True)
    code = db.StringField(required=True, unique=True)
    itemType = db.StringField(required=True)
    availableCount = db.IntField(required=True)
    stockPrice = db.FloatField(required=True)
    currencyFormat = db.StringField(required=True)
    discountAmount = db.FloatField()
    availableCoupons = db.ListField(db.StringField())
    images = db.ListField(db.StringField())