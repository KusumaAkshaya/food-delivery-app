'use client'

import { getCartItems, clearCart, removeFromCart } from "../utils/cardUtils"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([])
    const [mark, setMark] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        setCart(getCartItems());
    }, [])

    const handleRemoveItem = (index: number) => {
        removeFromCart(index);
        const newCart = getCartItems();
        setCart(newCart);
    };

    const handleAdd = (index: number) => {
        const newCart = getCartItems();
        if (newCart[index].quantity >= 10) window.alert("Oops! you can't add more");
        else {
            newCart[index].quantity += 1;
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    }

    const handleRemove = (index: number) => {
        const newCart = getCartItems();
        if (newCart[index].quantity === 1) {
            removeFromCart(index);
            setCart(getCartItems());
            return;
        }
        newCart[index].quantity -= 1;
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    }

const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!address.trim() || !mark.trim()) {
    alert("Please enter both address and landmark before placing order");
    return;
  }

  const userId = localStorage.getItem('userId'); // Or use your method to get user
  if (!userId) {
    alert("Login required to place order");
    router.push('/login');
    return;
  }

  const order = {
    userId,
    items: cart,
    totalPrice: totalPrice,
  };

  try {
    const response = await fetch("http://localhost:5000/orders/placeorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully!");
      setCart([]);
      clearCart();
      router.push('/placeOrder');
    } else {
      alert("Failed to place order: " + data.message);
    }
  } catch (error) {
    console.error("Order error:", error);
    alert("Server error while placing order");
  }
};
    const router = useRouter();
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="p-6 bg-gray-50 h-full flex flex-col justify-center items-center">
            <h1 className="text-3xl text-center font-bold mb-4" >Your Cart</h1>
            {cart.length === 0 ? (
                <div className="flex flex-col items-center h-screen m-auto" >
                    <Image src='/images/cart.jpg' alt="cart empty" width={200} height={200} />
                    <p>Your cart is empty</p>
                    <button>Go to <Link href='/search' className="text-gray-500" >Search</Link></button>
                </div>
            ) : (
                <section className="flex flex-col" >
                    <button>Go to <Link href='/search' className="text-gray-500" >Search</Link></button>
                    <div className="min-w-90 m-2 border-2 p-5 rounded-sm border-gray-500 bg-white shadow-md">
                        <div className="flex justify-between w-full sticky min-h-10 bg-gray-100 items-center pr-2" >
                            <Image src={`/images/restaurants/${cart[0].restaurant}.jpg`} alt="image" width={125} height={25} className="" />
                            <div><h2 className="text-2xl font-semibold capitalize" >{cart[0].restaurantname}</h2>
                                <p className="text-xl" >{cart[0].location}</p>
                            </div>
                        </div>
                        {cart.map((item, index) =>
                        (
                            <div key={index} className="flex items-center gap-4 border-b py-4">
                                <div className="w-25 h-25 rounded-full overflow-hidden shadow-md " > <Image src={item.image} alt={item.name} width={100} height={100} className="object-cover w-full h-full" /></div>
                                <div className="flex-1" >
                                    <h2 className="text-xl font-semibold" >{item.name}</h2>
                                    <p className="text-gray-500" >₹{item.price}</p>
                                </div>
                                <div className="bg-gray-200 py-2 px-3 flex gap-4 text-2xl rounded-sm " > <button className="text-3xl" onClick={() => handleAdd(index)} >+</button> <p className="" >{item.quantity}</p> <button className="text-3xl" onClick={() => handleRemove(index)} >-</button> </div>
                                <button className="font-bold bg-red-500 px-2 py-2 text-white" onClick={() => handleRemoveItem(index)} > X </button>
                            </div>
                        ))}
                        <div className="mt-6 text-xl font-bold border-b " > Total : ₹{totalPrice} </div>


                        <div className="bg-white border-2 border-gray-500 mt-7" >
                            <h2 className="p-2 font-semibold" >Enter Your Address</h2>
                            <form className="flex flex-col gap-4 p-4" onSubmit={handlePlaceOrder} >
                                <input type="text" placeholder="Delihery Address" className="border-b p-2" required onChange={(e) => setAddress(e.target.value)} />
                                <input type='text' placeholder="LandMark" className="border-b p-2 " required onChange={(e) => setMark(e.target.value)} />
                                <button type="submit"
                                    className="bg-green-500 text-white px-6 py-2 rounded mt-4"
                                >
                                    Proceed to Pay (Mock) </button>
                            </form>
                        </div>

                    </div>
                </section>

            )}
        </div>
    )
}