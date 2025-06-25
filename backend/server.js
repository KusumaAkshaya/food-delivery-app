import express from "express"
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import router from './routers/users.js';

const app = express()
dotenv.config()
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.use('/users', router);

app.listen(5000, () => {
    console.log('server started');
})

