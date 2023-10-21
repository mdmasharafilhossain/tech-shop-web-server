const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzichn4.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db('prodBD').collection('pro');
    

    app.get('/pro', async (req, res) => {
      const products =  productCollection.find();
      const result = await products.toArray();
      res.send(result);
    });

    app.put('/pro/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updatedProduct = req.body;

      const Product = {
        $set: {
          name:updatedProduct.name,
          BrandName:updatedProduct.BrandName,
          Type:updatedProduct.Type,
          Price:updatedProduct.Price,
          Des:updatedProduct.Des,
          Rating:updatedProduct.Rating,
          Image:updatedProduct.Image
        }
      }

      const result = await productCollection.updateOne(filter,Product,options);
      res.send(result);
    })

    app.get('/pro/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
      
    })

    app.post('/pro', async(req,res)=>{
        const newProducts = req.body;
        console.log(newProducts);
        const result = await productCollection.insertOne(newProducts);
        res.send(result);
    });
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Shop is running')
})

app.listen(port,()=>{
    console.log(`Shop Server running port :${port}`)
})