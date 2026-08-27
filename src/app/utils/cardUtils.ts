const BASE_URL = "http://localhost:5000";

export interface CartItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  restaurantname?: string;
  location?: string;
  image?: string;
}

// GET: Fetch user's cart from backend
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      credentials: "include", // Sends the auth cookie automatically
    });

    if (res.status === 401) {
      return []; // Not logged in
    }

    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("getCartItems error:", error);
    return [];
  }
}

// POST: Add or increment an item in the cart
export async function addCartItem(item: CartItem): Promise<CartItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error("Failed to add item");
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("addCartItem error:", error);
    return [];
  }
}

// PUT: Update item quantity
export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ itemId, quantity }),
    });

    if (!res.ok) throw new Error("Failed to update item quantity");
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("updateCartItemQuantity error:", error);
    return [];
  }
}

// DELETE: Remove an item by ID
export async function removeFromCart(itemId: string): Promise<CartItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/cart/item/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to remove item");
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("removeFromCart error:", error);
    return [];
  }
}

// DELETE: Clear entire cart
export async function clearCart(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/cart/clear`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error("clearCart error:", error);
  }
}