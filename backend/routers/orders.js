import express from "express";
import Order from "../model/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const orderRouter = express.Router();


// =====================================================
// PROTECT ALL ORDER ROUTES
// =====================================================

orderRouter.use(authMiddleware);


// =====================================================
// Helper function to get logged-in user's ID
// =====================================================

const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};


// =====================================================
// POST /orders/placeorder
//
// Places a new order
// =====================================================

orderRouter.post("/placeorder", async (req, res) => {

  try {

    const userId = getUserId(req);

    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });

    }


    const {
      items,
      totalPrice,
      deliveryAddress
    } = req.body;


    // Basic validation
    if (!items || items.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });

    }


    if (!deliveryAddress?.address) {

      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });

    }


    // Create new order
    const newOrder = new Order({

      userId,

      items,

      totalPrice,

      deliveryAddress,

    });


    // Save to MongoDB
    await newOrder.save();


    return res.status(201).json({

      success: true,

      message: "Order placed successfully!",

      order: newOrder,

    });


  } catch (error) {

    console.error("Error placing order:", error);

    return res.status(500).json({

      success: false,

      message: error.message || "Failed to place order",

    });

  }

});


// =====================================================
// GET /orders/history
//
// Returns all orders belonging to logged-in user
// =====================================================

orderRouter.get("/history", async (req, res) => {

  try {

    const userId = getUserId(req);


    if (!userId) {

      return res.status(401).json({

        success: false,

        message: "User not authenticated",

      });

    }


    const orders = await Order.find({
      userId: userId
    })
      .sort({
        createdAt: -1
      });


    return res.status(200).json({

      success: true,

      orders,

    });


  } catch (error) {

    console.error(
      "Error fetching order history:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Failed to fetch order history",

    });

  }

});


export default orderRouter;