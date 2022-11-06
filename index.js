const express = require('express');
const cors = require('cors');
require('colors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

//* Mongodb Atlas
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yeflywl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database connected'.yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
};

dbConnect();

const productCollection = client.db('emaJohn').collection('products');

app.get('/', (req, res) => {
  res.send('Ema John Server is running');
});

//* GET (READ)
app.get('/products', async (req, res) => {
  try {
    const currentPage = Number(req.query.currentPage) || 0;
    const perPageItem = Number(req.query.perPageItem) || 10;
    console.log(currentPage, perPageItem);

    const query = {};
    const cursor = productCollection.find(query);

    const products = await cursor
      .skip(currentPage * perPageItem)
      .limit(perPageItem)
      .toArray();

    const count = await productCollection.estimatedDocumentCount();
    res.send({ count, products });
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* POST (READ) [Exception]
app.post('/productsByIds', async (req, res) => {
  try {
    const ids = req.body;
    const objectIds = ids.map((id) => ObjectId(id));
    const query = { _id: { $in: objectIds } };
    const cursor = productCollection.find(query);
    const products = await cursor.toArray();
    res.send(products);
  } catch (error) {
    console.log(error.message.bold);
  }
});

app.listen(port, () => {
  console.log('Server up and running'.cyan.bold);
});
