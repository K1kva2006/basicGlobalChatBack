const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

app.use(cors({
  origin: 'https://basicglobalchat.netlify.app',
  credentials: true,
}));
app.use(express.json());

const client = new MongoClient(process.env.CONNECTION_STRING);

app.get("/", async (req, res) => {
    await client.connect();
    const db = client.db("myDB");
    const messagesCollection = db.collection("messages");
    const messages = await messagesCollection.find().toArray();
    res.status(200).json(messages);
});

app.post("/", async (req, res) => {
    await client.connect();
    const db = client.db("myDB");
    const messagesCollection = db.collection("messages");
    const addMessage = await messagesCollection.insertOne(req.body);
    res.status(200).send("Success");
});

app.delete("/", async (req, res) => {
    await client.connect();
    const db = client.db("myDB");
    const messagesCollection = db.collection("messages");
    await messagesCollection.deleteOne({ _id: new ObjectId(req.body._id) });
    res.status(200).send("Success");
});

app.listen(process.env.PORT, () => console.log("SUCCESS"));
