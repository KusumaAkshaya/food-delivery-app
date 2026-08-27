'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  getCartItems, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart, 
  CartItem 
} from "../utils/cardUtils"

const baseUrl = "http://localhost:5000";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mark, setMark] = useState('')
  const [address, setAddress] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch(`${baseUrl}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const items = await getCartItems();
        setCart(items);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleRemoveItem = async (itemId: string) => {
    const updatedCart = await removeFromCart(itemId);
    setCart(updatedCart);
  };

  const handleAdd = async (index: number) => {
    const item = cart[index];
    if (item.quantity >= 10) {
      alert("Oops! You can't add more than 10 of this item.");
      return;
    }
    const updatedCart = await updateCartItemQuantity(item._id || String(index), item.quantity + 1);
    setCart(updatedCart);
  };

  const handleRemove = async (index: number) => {
    const item = cart[index];
    if (item.quantity === 1) {
      handleRemoveItem(item._id || String(index));
      return;
    }
    const updatedCart = await updateCartItemQuantity(item._id || String(index), item.quantity - 1);
    setCart(updatedCart);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim() || !mark.trim()) {
      alert("Please enter both delivery address and landmark");
      return;
    }

    setIsSubmitting(true);
    const order = {
      items: cart,
      totalPrice: totalPrice,
      deliveryAddress: { address, landmark: mark }
    };

    try {
      const response = await fetch(`${baseUrl}/orders/placeorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        router.push('/login');
        return;
      }

      if (response.ok) {
        setCart([]);
        await clearCart();
        router.push('/placeOrder');
      } else {
        alert("Failed to place order: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Server error while placing order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const platformFee = cart.length > 0 ? 5 : 0;
  const grandTotal = totalPrice + deliveryFee + platformFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Back to search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">Your Cart</h1>
          </div>

          <Link
            href="/search"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
          >
            <span>+ Add more dishes</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="relative w-36 h-36 mx-auto mb-4 opacity-90">
              <Image 
                src="/images/cart.jpg" 
                alt="Empty Cart" 
                fill 
                className="object-contain"
                onError={(e) => {
                  // Fallback visual emoji if image isn't available
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full flex items-center justify-center text-5xl">
                🛒
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h2>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
              Looks like you haven&apos;t added any delicious food yet. Explore nearby top-rated restaurants!
            </p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-xs active:scale-95"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          /* 2-Column Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Restaurant Banner + Food Items List */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Restaurant Header Card */}
              {cart[0]?.restaurantname && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 overflow-hidden text-xl">
                    🏪
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {cart[0].restaurantname}
                      </h2>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        Active Order
                      </span>
                    </div>
                    {cart[0].location && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{cart[0].location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order Items ({totalItemsCount})
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item, index) => (
                    <div key={item._id || index} className="p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-50/50 transition-colors">
                      {/* Dish Thumbnail */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={item.image || "/images/default-food.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Name & Single Item Price */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          ₹{item.price}
                        </p>
                      </div>

                      {/* Quantity Stepper: [- QTY +] */}
                      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shrink-0 shadow-inner">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-orange-500 active:text-white font-bold text-xs transition-colors"
                          onClick={() => handleRemove(index)}
                          title="Decrease"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-orange-600">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-orange-500 active:text-white font-bold text-xs transition-colors"
                          onClick={() => handleAdd(index)}
                          title="Increase"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total Subtotal */}
                      <div className="text-right w-14 sm:w-16 shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item._id || String(index))}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Details & Bill Summary */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Address Form Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <h2 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <span className="text-orange-500">📍</span> Delivery Address
                </h2>
                
                <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Complete Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Sunshine Apts, Main Road"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50/50"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near City Hospital or Metro Gate 2"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50/50"
                      required
                      value={mark}
                      onChange={(e) => setMark(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              {/* Bill Details Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <h2 className="font-bold text-slate-900 text-sm mb-3.5">Bill Summary</h2>
                
                <div className="space-y-2 text-xs text-slate-600 pb-3 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-semibold text-slate-800">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Delivery Fee
                      {deliveryFee === 0 && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded font-bold">FREE</span>
                      )}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {deliveryFee === 0 ? <span className="line-through text-slate-400 mr-1">₹40</span> : null}
                      ₹{deliveryFee}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform & Taxes</span>
                    <span className="font-semibold text-slate-800">₹{platformFee}</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-baseline mb-5">
                  <span className="font-bold text-sm text-slate-900">To Pay</span>
                  <span className="text-lg font-black text-slate-900">₹{grandTotal}</span>
                </div>

                {/* Checkout Submit Button */}
                <button
                  type="submit"
                  form="orderForm"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-400 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Pay</span>
                      <span className="text-orange-400">→</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}