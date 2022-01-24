const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const res = require("express/lib/response");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qazkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


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

        app.post('/food/cart', async (req, res) => {
            const body = req.body.ids
            let product = [];
            for (const id of body) {
                const query = { _id: ObjectId(id) };
                const result = await foodCollection.findOne(query);
                product.push(result);

            }
            res.json(product);
            console.log(product);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log("listen to port", port);
})