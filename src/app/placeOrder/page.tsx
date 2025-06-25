'use client'
import Link from "next/link"

export default function PlacedOrder()
{
    return(
        <section className="flex flex-col justify-center items-center align-middle h-screen m-auto my-auto" >
            <p className="text-3xl" >Thank You!</p>
            <p>We picked your Order</p>
            <button>Go Back<Link href='/' className="text-gray-500" > Home</Link></button>
        </section>
    )
}