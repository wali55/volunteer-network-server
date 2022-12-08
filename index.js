const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m6xp0hi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const volunteerCollection = client.db('volunteerNetwork').collection('service');

        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = volunteerCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // post a new service
        app.post('/service', async(req, res) => {
            const newService = req.body;
            const result = await volunteerCollection.insertOne(newService);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server running');
})

app.listen(port, () => {
    console.log('listening');
})