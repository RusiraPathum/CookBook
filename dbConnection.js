const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL


// const uri = "mongodb+srv://root:root@cluster1.2ockrve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

const client = new MongoClient(MONGO_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}

module.exports = { client, run };