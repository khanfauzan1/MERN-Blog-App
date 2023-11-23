const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const path =require('path');

//env config
dotenv.config();

//router import
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

//mongoDB connection
connectDB();
// rest objects
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

app.use(express.static(path.join(__dirname,'./client/build')))


app.get('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
//Port
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
  console.log(`server running on ${process.env.DEV_NODE} mode on port ${PORT}`);
});
