const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

app.use(authRoutes);

app.listen(5000, () => {
   console.log("server is listening ");
});
