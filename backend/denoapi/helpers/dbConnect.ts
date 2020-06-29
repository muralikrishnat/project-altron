import { MongoClient, init } from "https://deno.land/x/mongo@v0.7.0/mod.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://mongodb-app:27017");
// client.connectWithUri("mongodb://localhost:27017");
const db = client.database("project-altron");
const cartItems = db.collection("cartitems");
export {
    db, 
    cartItems
};