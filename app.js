const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URL)

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

app.post("/api/register", async (req,res) => {
//   console.log(req.body)


  const {username,password: plainTextPassword} = req.body;
  const password = await bcrypt.hash(plainTextPassword,10)

    if(!username || typeof username !== "string"){
      return res.json({status: 'error', error: "Invalid username"});
    }
    if(!plainTextPassword || typeof plainTextPassword !== "string"){
      return res.json({status: 'error', error: "Invalid password"});
    }
    if(plainTextPassword.length < 5){
      return res.json({status: 'error', error: "Password shoulb be 6 characters"});
    }

  try {
      const result = await User.create({username,password})
       console.log(result);
  } catch (error) {
    if(error.code === 11000){
      return res.json({status:'error',error:'Username already in use'})
    }
    throw error
  }

  // console.log(await bcrypt.hash(password, 10));
});

app.listen(5000, () => {
  console.log("server is listening ");
});
