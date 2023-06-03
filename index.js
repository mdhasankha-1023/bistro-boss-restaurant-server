const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middle-were
app.use(cors())
app.use(express.json())


// connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgqmoa1.mongodb.net/?retryWrites=true&w=majority`;

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

    // DB collection
    const menusCollection = client.db('bistrobossDB').collection('menus')
    const reviewsCollection = client.db('bistrobossDB').collection('reviews')

    // get all menus
    app.get('/menus', async(req, res)=> {
        const result = await menusCollection.find().toArray();
        res.send(result)
    })

    // get all reviews
    app.get('/reviews', async(req, res)=> {
        const result = await reviewsCollection.find().toArray();
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// get all menus


app.get('/', (req, res)=> {
    res.send('This is bistro boss rasturent')
})

app.listen(port, () => {
    console.log(`This server open on: ${port}`)
})