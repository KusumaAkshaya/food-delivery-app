import express from 'express'
import Order from '../model/Order.js';
const orderRouter = express.Router();

orderRouter.post('/placeorder', async (req, res) => {
    try{
       const placeOrder = new Order(req.body);
       await placeOrder.save();
       res.status(201).json({message : 'Placed Order successfully'});
    }
    catch(error){
       console.error('Error in saving order', error);
       res.status(500).json({message: 'Failed to save order, please try again'});
    }
} )

export default orderRouter;