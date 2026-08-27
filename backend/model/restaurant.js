import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    Latitude: Number,
    Longitude: Number},
  {
    strict: false,
    collection: "restaurants",
  }
);

 const Restaurant =
  mongoose.models.Restaurant ||
  mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;