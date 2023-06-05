const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const menuCollection = client.db('bistrobossDB').collection('menus')
    const reviewCollection = client.db('bistrobossDB').collection('reviews')
    const foodCartCollection = client.db('bistrobossDB').collection('carts')
    const userCollection = client.db('bistrobossDB').collection('users')


    //---------------------
    // menus related Api
    // --------------------

    // get all menus
    app.get('/menus', async(req, res)=> {
        const result = await menuCollection.find().toArray();
        res.send(result)
    })

    //---------------------
    // reviews related Api
    // --------------------

    // get all reviews
    app.get('/reviews', async(req, res)=> {
        const result = await reviewCollection.find().toArray();
        res.send(result)
    })
    
    //---------------------
    // foodCart related Api
    // --------------------

    // post food cart
    app.post('/carts', async(req, res)=> {
      const cart = req.body;
      const result = await foodCartCollection.insertOne(cart);
      res.send(result)
    })

    // get food cart
    app.get('/carts', async(req, res)=> {
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {email : email}
      const result = await foodCartCollection.find(query).toArray();
      res.send(result)
    })

    // delete food cart
    app.delete('/carts/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await foodCartCollection.deleteOne(filter)
      res.send(result)
    })

    //---------------------
    // users related Api
    // --------------------

    // post user
    app.post('/user', async(req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    // get users
    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    // update users info
    app.patch('/users/:id', async(req, res)=> {
      const id = req.params.id;
      console.log(id)
      const filter = {_id: new ObjectId(id)}
      const updateUser = {
      $set: {
        role: 'admin'
      }
    };
      const result = await userCollection.updateOne(filter, updateUser)
      res.send(result)
    })

    // delete user
    app.delete('/users/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(filter)
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

// set route for server testing
app.get('/', (req, res)=> {
    res.send('This is bistro boss rasturent')
})

app.listen(port, () => {
    console.log(`This server open on: ${port}`)
})