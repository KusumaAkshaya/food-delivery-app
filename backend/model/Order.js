import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:
    {
        type:String,
        required: true,
    },
    items:
    [{
       name:String,
       price: Number,
       quantity:Number,
       restuarant: String,
       image:String, 
    }],
    totalPrice: Number,
    date:
    {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Order', orderSchema)