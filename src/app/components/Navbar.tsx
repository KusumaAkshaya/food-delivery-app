'use client'
import Link from 'next/link';
import {useState} from "react";

export default function Navbar()
{

    const [message, setMessage] = useState('')
    const handleLogOut = () => {
        setMessage('You Logged Out from Your Accout');
        setTimeout(() => setMessage(''), 2000);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.setItem("user", '');
        localStorage.setItem('cart', '');
    }

    return(
        <nav className="flex flex-row-reverse w-full top-0 start-0 p-10" style={{backgroundImage : 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))'}}>
        <div className="space-x-8">
            <Link href="/" className="text-white" >Home</Link>
            { localStorage.getItem("isLoggedIn") !== "true" ? (<><Link href="/login" className="text-white" >Login</Link>
            <Link href="/register" className="text-white" >Register</Link></>) : (<><button className="text-white" onClick={() => handleLogOut()}>Log-Out</button> 
            <Link href="/cart" className="text-white" >Cart</Link></>)}
    
        </div>
         {message && (
                    <div className="fixed right-4 bg-green-500 text-white p-4 rounded shadow-lg text-sm animate-bounce z-50">{message}</div>
                )}
        </nav>
    )
}