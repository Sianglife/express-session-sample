require("dotenv").config();

const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB;
const client = new MongoClient(uri);
client
  .db("my_db")
  .collection("users")
  .createIndex({ name: 1 }, { unique: true })
  .then((e) => {
    console.log(e);
  });
