from flask import Flask, jsonify, request, Response
import db
from flask_cors import CORS

app = Flask(__name__)

# app.config['MONGODB_SETTINGS'] = {
#     'host': 'mongodb://mongodb-app:27017/project-altron'
# }
app.config['MONGODB_SETTINGS'] = {
    'host': 'mongodb://localhost:27017/project-altron'
}

db.initialize_db(app)
CORS(app)


@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = db.inventory.objects().to_json()
    return Response(items, mimetype="application/json", status=200)

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    inventoryItem = request.get_json()
    db.inventory(**inventoryItem).save()
    items = db.inventory.objects().to_json()
    return Response(items, mimetype="application/json", status=200)

@app.route('/api/inventory/<string:code>', methods=['POST'])
def update_inventory(code):
    inventoryItem = request.get_json()
    db.inventory.objects.get(code=code).update(**inventoryItem)
    items = db.inventory.objects().to_json()
    return Response(items, mimetype="application/json", status=200)

@app.route('/api/inventory/<string:code>', methods=['DELETE'])
def delete_inventory(code):
    db.inventory.objects.get(code=code).delete()
    items = db.inventory.objects().to_json()
    return Response(items, mimetype="application/json", status=200)

app.run(host='0.0.0.0')