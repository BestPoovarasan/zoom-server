const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient=mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.DB;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

//<------- middleware------------>
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


// <---------sample Home page------------>
app.get('/', (req, res) => {
    res.send('Hello World!')
  });


  // let authenticate = function (req, res, next) {
  //   if (req.headers.authorization) {
  //     let verify = jwt.verify(req.headers.authorization, SECRET);
  //     if (verify) {
  //       req.user_id = verify._id;
  //       next();
  //     } else {
  //       res.status(401).json({message: "unauthorized"});
  //     }
  //   } else {
  //     res.status(401).json({message: "unauthorized"});
  //   }
  // }
   


// <---------------Register steps----------------->
 app.post("/signup", async function (req, res) {
    try {
      // Open the Connection
      const connection = await mongoClient.connect(URL);
      // Select the DB
      const db = connection.db("zoom");
      //<-------bcrypt is used for password security---------->
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      req.body.password = hash;
      // Select the Collection
      await db.collection("zoomusers").insertOne(req.body);
      // Close the connection
      await connection.close();
      res.json({
        message: "Successfully Registered",
      });
    } catch (error) {
      res.json({
        message: "Error, Try Again",
      });
    }
  });

// <---------------login steps----------------->
app.post("/login", async function (req, res) {
    try {
      // Open the Connection
      const connection = await mongoClient.connect(URL);
      // Select the DB
      const db = connection.db("zoom");
      // Select the Collection
      const user = await db.collection("zoomusers").findOne({ email: req.body.email });
      if (user) {
        const match = await bcryptjs.compare(req.body.password, user.password);
        if (match) {
          // Token
          const token = jwt.sign({ _id: user._id }, "q5IUZ87DdZkK00AocKqs");
          res.json({
            message: "Successfully Login",
            token,
          });
        } else {
          res.status(401).json({
            message: "Password is incorrect",
          });
        }
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
