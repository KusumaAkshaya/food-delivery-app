'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type o =
{
    userId:string,
    items: [{
      name: string,
      price: number,
      quantity: number,
      restaurant: string,
      image: string,
    }]
    totalPrice: number,
    date:string,
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<o[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) return;

      const res = await fetch(`http://localhost:5000/orders/${session.user.id}`, 
        {
            method: 'GET',
            
        }
      );
      const data = await res.json();
      setOrders(data.orders);
    };

    fetchOrders();
  }, [session]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={idx} className="border p-4 rounded-lg bg-white shadow">
              <p className="text-sm text-gray-500 mb-2">🕒 {new Date(order.date).toLocaleString()}</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right font-semibold mt-2">Total: ₹{order.totalPrice}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
