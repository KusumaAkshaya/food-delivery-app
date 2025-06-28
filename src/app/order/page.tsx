'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react';

type Item = {
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
};

type PrevOrder = {
  _id: string;
  userId: string;
  items: Item[];
  totalPrice: number;
  date: string;
};

export default function Order() {
  const [orders, setOrders] = useState<PrevOrder[]>([]);

  useEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/orders/${user}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-10 bg-gray-100 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Your Orders</h2>
       <p className="text-center mb-4" >Go back <Link href='/' className="text-gray-500" >Home</Link></p>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6 w-4/5 md:w-2/3 sm:w-2/3 lg:w-1/2">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg bg-white shadow">
              <p className="text-sm text-gray-500 mb-2">
                🕒 {new Date(order.date).toLocaleString()}
              </p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right text-orange-500 font-semibold mt-2">
                Total: ₹{order.totalPrice}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
