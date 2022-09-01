const express = require('express');
const app = express();
var cors = require('cors');
const mongodb = require("mongodb");
const mongoClient=mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.DB;

//<------- middleware------------>
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


// <---------sample------------>
app.get('/', (req, res) => {
    res.send('Hello World!')
  });


// <---------------Register steps----------------->
 app.post("/signup", async function (req, res) {
    try {
      // Open the Connection
      const connection = await mongoClient.connect(URL);
      // Select the DB
      const db = connection.db("zoom");
      // Select the Collection
      await db.collection("zoomusers").insertOne(req.body);
      // Close the connection
      await connection.close();
      res.json({
        message: "Successfully Registered",
      });
    } catch (error) {
      res.json({
        message: "Error",
      });
    }
  });

// <---------------login steps----------------->
  app.post("/signin", async function (req, res) {
    try {
      // Open the Connection
      const connection = await mongoClient.connect(URL);
      // Select the DB
      const db = connection.db("zoom");
      // Select the Collection
      const user = await db.collection("zoomusers").findOne({ email: req.body.email });
      if (user) {
        res.json({
          message: "Successfully Logged In",
        });
      } else {
        res.status(401).json({
          message: "User not found",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });









app.listen(process.env.PORT || 3001);