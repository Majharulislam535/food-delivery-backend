const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qazkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
    res.send('hello world');
})


async function run() {
    try {
        await client.connect();
        const database = client.db("foodCollection");
        const foodCollection = database.collection("food");

        app.get('/food', async (req, res) => {
            const cursor = foodCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log("listen to port", port);
})