'use client'
import Link from "next/link"

export default function PlacedOrder()
{
    return(
        <section className="flex flex-col items-center align-middle h-screen m-auto my-auto" >
            <p className="text-3xl" >Thank You!</p>
            <p>We picked your Order</p>
            <button><Link href='/' >Go Back Home</Link></button>
        </section>
    )
}