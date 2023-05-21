const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))
app.use(express.json());

// Mongodb code here

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjkyc58.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
});

async function run() {
    try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const categoriesCollection = client.db('ToysLand').collection('categories');

    app.get('/categories/:text', async(req, res) => {
        console.log(req.params.text);
        const text = req.params.text;
        if(text == "sportscar" || text == 'truck' || text == 'regularcar'){
            const result = await categoriesCollection.find({status : text}).toArray();
            return res.send(result);
        }
    });

    // get method
    app.get('/addToy', async(req, res) => {
        const cursor = categoriesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    
    app.get('/addToy/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        // const options = {
        //     projection : {
        //         toyName, photoUrl: 1, sellerName: 1, email: 1, category: 1, price: 1, rating: 1, quantity: 1
        //     }
        // }
        const result = await categoriesCollection.findOne(query);
        res.send(result);
    })
    

    app.get('/addToy', async(req, res) => {
        
        let query = {};
        
        if(req.query?.email){
            query = { email : req.query.email }
            console.log(query);
        }
        const cursor = categoriesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    
    // post method
    app.post('/addToy', async(req, res) => {
        const newToy = req.body;
        console.log(newToy);
        const result = await categoriesCollection.insertOne(newToy);
        res.send(result);
    });

    // method delete
    app.delete('/addToy/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await categoriesCollection.deleteOne(query);
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

// Mongodb code here










app.get('/', (req, res) => {
    res.send('Toys Land is Running');
})

app.listen(port, () => {
    console.log(`Toys Land is running on port : ${port}`);
})