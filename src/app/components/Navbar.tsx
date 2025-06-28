'use client'
import Link from 'next/link';
import Image from 'next/image'
import {useState, useEffect} from "react";
import { Lobster_Two } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
import {motion, AnimatePresence} from 'framer-motion'

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
})



export default function Navbar()
{
    const [login, setLogin] = useState(false);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    const handleLogOut = () => {
        setMessage('You Logged Out from Your Accout');
        setTimeout(() => setMessage(''), 2000);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.setItem("userId", '');
        setLogin(false);
        localStorage.setItem('cart', '');
    }
    
    useEffect(() => {
    const userId = typeof window !== 'undefined' && localStorage.getItem("userId");
    if (userId) {
      setLogin(true);
    }
  }, []);

    return(
      <>
        <nav className="flex flex-row justify-between w-full top-0 start-0 py-5" style={{backgroundImage : 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))'}}>
        <div className="flex px-2 gap-1 items-center" >
           <Image src='/logoblack.jpg' alt="logo" width={50} height={40} ></Image>
           <h2 className={`text-orange-300 text-3xl ${lobsterTwo.className}`}>FoodieExpress</h2>
        </div>
        <div className="hidden space-x-8 md:flex items-center">
            <Link href="/" className="text-white" >Home</Link>
            { login !== true ? (<><Link href="/login" className="text-white" >Login</Link>
            <Link href="/register" className="text-white" >Register</Link></>) : (<><button className="text-white" onClick={() => handleLogOut()}>Log-Out</button> 
            <Link href="/cart" className="text-white" >Cart</Link>
            <Link href='/order' className="text-white">Orders</Link>
            </>)}
            
        </div>
        
        <div className="md:hidden z-[100] cursor-pointer flex items-center" onClick={() => setOpen(!open)} >
          <FontAwesomeIcon icon={open ? faTimes : faBars} className="text-3xl text-center pr-4 text-orange-400" ></FontAwesomeIcon>
        </div>

         <AnimatePresence>
        {open && (
          <motion.div className={`md:hidden absolute top-21 right-0 flex flex-col w-full bg-black/65 py-5 text-center`} animate={{opacity: 1}} initial={{opacity:0}} exit={{opacity: 0}} transition={{delay: 0.3}} >
              <Link href="/" className="text-white text-2xl hover:text-orange-300 hover:text-3xl border-b border-orange-200 mx-3 pb-2" >Home</Link>
            { login !== true ? (<><Link href="/login" className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2" >Login</Link>
            <Link href="/register" className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2">Register</Link></>) : (<><button className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2" onClick={() => handleLogOut()}>Log-Out</button> 
            <Link href="/cart" className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2" >Cart</Link>
            <Link href='/order' className="text-white text-2xl hover:text-orange-300 hover:text-3xl">Orders</Link>
            </>)}
          </motion.div>
        )}
        </AnimatePresence>

         {message && (
                    <div className="fixed right-4 bg-green-500 text-white p-4 rounded shadow-lg text-sm animate-bounce z-50">{message}</div>
                )}
        </nav>
        </>
    )
}

