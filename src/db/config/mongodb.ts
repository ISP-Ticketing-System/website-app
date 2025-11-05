import { MongoClient } from 'mongodb';
// const uri = process.env.MONGO_URI || "";
const uri = process.env.MONGO_URI as string; // type casting

// Create a MongoClient
const client = new MongoClient(uri);

// Create Database
const database = client.db("db_isp_ticket_system");

export default database;