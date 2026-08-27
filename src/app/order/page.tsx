'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  name: string
  price: number
  quantity: number
  restaurant?: string
}

type PrevOrder = {
  _id: string
  userId: string
  items: Item[]
  totalPrice: number
  deliveryAddress?: {
    address: string
    landmark: string
  }
  createdAt: string
}

const baseUrl = "http://localhost:5000"

export default function Order() {

  const [orders, setOrders] = useState<PrevOrder[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        // ----------------------------------
        // 1. Check whether user is logged in
        // ----------------------------------
        const userRes = await fetch(`${baseUrl}/users/me`, {
          method: "GET",
          credentials: "include",
        })

        if (!userRes.ok) {
          router.push("/login")
          return
        }

        // ----------------------------------
        // 2. Fetch logged-in user's orders
        // ----------------------------------
        const orderRes = await fetch(`${baseUrl}/orders/history`, {
          method: "GET",
          credentials: "include",
        })

        if (orderRes.status === 401) {
          router.push("/login")
          return
        }

        const data = await orderRes.json()

        if (orderRes.ok && data.success) {
          setOrders(data.orders)
        } else {
          console.error(
            "Failed to fetch orders:",
            data.message
          )
        }

      } catch (error) {

        console.error(
          "Error fetching order history:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    fetchOrders()

  }, [router])


  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading your orders...
      </div>
    )
  }


  return (
    <div className="p-10 min-h-screen bg-gray-100 flex flex-col items-center">

      <h2 className="text-2xl font-bold mb-4 text-orange-500">
        Your Orders
      </h2>

      <p className="text-center mb-6">
        Go back{" "}
        <Link
          href="/"
          className="text-gray-500 underline"
        >
          Home
        </Link>
      </p>

      {orders.length === 0 ? (

        <p>No orders found.</p>

      ) : (

        <div className="space-y-6 w-4/5 md:w-2/3 lg:w-1/2">

          {orders.map((order) => (

            <div
              key={order._id}
              className="border p-4 rounded-lg bg-white shadow"
            >

              {/* Order time */}
              <p className="text-sm text-gray-500 mb-3">
                🕒 {new Date(order.createdAt).toLocaleString()}
              </p>


              {/* Order items */}
              <ul className="space-y-2">

                {order.items.map((item, index) => (

                  <li
                    key={index}
                    className="flex justify-between"
                  >

                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ₹{item.price * item.quantity}
                    </span>

                  </li>

                ))}

              </ul>


              {/* Delivery Address */}
              {order.deliveryAddress && (

                <div className="mt-4 text-sm text-gray-600">

                  <p className="font-semibold">
                    Delivery Address
                  </p>

                  <p>
                    {order.deliveryAddress.address}
                  </p>

                  <p>
                    Landmark: {order.deliveryAddress.landmark}
                  </p>

                </div>

              )}


              {/* Total */}
              <div className="text-right text-orange-500 font-semibold mt-4">

                Total: ₹{order.totalPrice}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}