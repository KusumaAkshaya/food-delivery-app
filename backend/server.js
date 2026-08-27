import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // 🔴 NEW
import  Restaurant from "./model/restaurant.js";
import router from "./routers/users.js";
import orderRouter from "./routers/orders.js";
import cartRouter from "./routers/carts.js"
import restaurant from "./routers/restaurant.js"

// 🔴 Load environment variables FIRST
dotenv.config();

const app = express();


// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // 🔴 IMPORTANT: allows cookies
}));


// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json());

app.use(cookieParser()); // 🔴 NEW
// This allows us to later access:
// req.cookies.token


// --------------------------------------------------
// MongoDB
// --------------------------------------------------

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });


// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/users", router);
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);
app.use("/restaurants", restaurant);

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(5000, () => {
    console.log("server started on port 5000");
});

app.get("/api/restaurants/test", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).limit(5);

    res.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Restaurant API error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});