const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")
const cors = require("cors")

const app = express()
const MONGO_URI = process.env['MONGO_URI']

app.use(express.json())
app.use(cors())

app.get("/todos", async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI)
    await client.connect()
    const collection = client.db("dotodo").collection("todos")
    const list = await collection.find({}).sort({ rank: 1 }).toArray()
    await client.close()
    res.status(200).send(list)
  }
  catch (e) {
    console.log(e)

    res.send("error")
  }
})

app.post("/todos/add", async (req, res) => {
  try {
    const _id = req.body._id
    const task = req.body.task
    const rank = req.body.rank
    const client = new MongoClient(MONGO_URI)
    await client.connect()
    const collection = client.db("dotodo").collection("todos")
    const length = (await collection.find({}).toArray()).length
    const result = await collection.insertOne({ _id, rank, task })
    await client.close()
    res.status(200).send(result.insertedId)
  }
  catch (e) {
    console.log(e)

    res.send("error")
  }
})

app.put("/todos/:taskId", async (req, res) => {
  try {
    let taskId
    if (req.params.taskId) taskId = req.params.taskId; else throw "undefined"

    const client = new MongoClient(MONGO_URI)
    await client.connect()
    const collection = client.db("dotodo").collection("todos")
    const result = await collection.updateOne({ _id: taskId }, { $set: { rank: req.body.rank } })
    await client.close()
    res.status(200).send(result.upsertedId)
  }
  catch (e) {
    console.log(e)

    res.send("error")
  }
})

app.delete("/todos/delete/:taskId", async (req, res) => {
  try {
    let taskId
    if (req.params.taskId) taskId = req.params.taskId; else throw "undefined"
    const client = new MongoClient(MONGO_URI)
    await client.connect()
    const collection = client.db("dotodo").collection("todos")
    const result = await collection.deleteOne({ _id: taskId })
    await client.close()
    res.status(200).send(result.deletedDoc)
  }
  catch (e) {
    console.log(e)
    res.send("error")
  }
})

app.get("/todos/clear", async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI)
    await client.connect()
    const collection = client.db("dotodo").collection("todos")
    await collection.deleteMany({})
    await collection.insertOne({ _id: "kjsabd893443uhri43uhf9oas", task: "do groceries", rank: 1 })
    await client.close()
    res.status(200).send("done")
  }
  catch (e) {
    console.log(e)

    res.send("error")
  }
})

app.listen(3000, () => {
  console.log("Server is running")
})