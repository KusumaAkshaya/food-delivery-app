import express from "express";
import Cart from "../model/carts.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Adjust path to your auth middleware

const router = express.Router();

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Helper to extract user ID from decoded JWT payload
const getUserId = (req) => req.user.id || req.user._id || req.user.userId;

// --------------------------------------------------
// GET /cart - Fetch user's cart
// --------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// --------------------------------------------------
// POST /cart/add - Add or increment an item
// --------------------------------------------------
router.post("/add", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name, price, quantity = 1, restaurant, restaurantname, location, image } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // If adding an item from a different restaurant, clear previous items
    if (cart.items.length > 0 && cart.items[0].restaurant !== restaurant) {
      cart.items = [];
    }

    // Check if the item already exists
    const existingIndex = cart.items.findIndex(
      (item) => item.name === name && item.restaurant === restaurant
    );

    if (existingIndex > -1) {
      const newQuantity = cart.items[existingIndex].quantity + quantity;
      cart.items[existingIndex].quantity = Math.min(newQuantity, 10);
    } else {
      cart.items.push({
        name,
        price,
        quantity: Math.min(quantity, 10),
        restaurant,
        restaurantname,
        location,
        image,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", items: cart.items });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// --------------------------------------------------
// PUT /cart/update - Update quantity of a specific item
// --------------------------------------------------
router.put("/update", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = Math.min(quantity, 10);
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", items: cart.items });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// --------------------------------------------------
// DELETE /cart/item/:itemId - Remove single item
// --------------------------------------------------
router.delete("/item/:itemId", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items.pull(itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed", items: cart.items });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// --------------------------------------------------
// DELETE /cart/clear - Clear entire cart
// --------------------------------------------------
router.delete("/clear", async (req, res) => {
  try {
    const userId = getUserId(req);

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({ message: "Cart cleared successfully", items: [] });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;