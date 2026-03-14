import { MongoClient } from "mongodb";

let db;

async function connectDB() {
  if (db) return db;

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();

  console.log("Connected to MongoDB");
  return db;
}

export default connectDB;
