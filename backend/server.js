import express from "express"
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import router from './routers/users.js';
import orderRouter from './routers/orders.js';

const app = express()
dotenv.config()
app.use(cors(
  {
    origin:["https://foodieexpress17.netlify.app/","https://food-delivery-app-wa8y.vercel.app", "https://food-delivery-app-drab.vercel.app/" , "http://localhost:3000/"],
    credentials:true,
  }
));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.use('/users', router);
app.use('/orders', orderRouter)

app.listen(5000, () => {
    console.log('server started');
})

