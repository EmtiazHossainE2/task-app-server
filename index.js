const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const cors = require('cors');
require('dotenv').config()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1g7f0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);


async function run() {
    try {
        await client.connect();
        const todosCollection = client.db("todos").collection("todos");

        //add todo 
        app.post('/addtodo', async (req, res) => {
            const todo = req.body
            const result = await todosCollection.insertOne(todo)
            res.send(result)
        })

        //get all todos
        app.get('/todos', async (req, res) => {
            const query = {}
            const todos = await todosCollection.find(query).toArray()
            res.send(todos)
        })

        // update todo
        app.patch('/todos/:id', async (req, res) => {
            const id = req.params.id
            const todoInfo = req.body
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: todoInfo
            };
            const result = await todosCollection.updateOne(filter, updateDoc);
            res.send(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running port ${port}`)
})