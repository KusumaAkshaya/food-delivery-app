'use client';
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const imageSRC = [
    {
        src: '/images/restaurants/greendelight.jpg',
    },
    {
        src: '/images/restaurants/spicehub.jpg',
    },
    {
        src: '/images/restaurants/tandoori.jpg',
    }
]


export default function LoginPage() {

const [index, setIndex] = useState(0);
    
useEffect( () =>
{
   const timer = setInterval(() => {
      setIndex((prev) => (prev+1)%imageSRC.length);
   }, 3000)
   return () => clearInterval(timer);
}, []);

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

    return (
      <div className="flex h-screen items-center justify-center bg-gray-100" >
         <div className="login-left w-full md:w-1/2 flex flex-col items-center shadow-xl bg-white pt-10 pb-10 h-3/4">
            <h2 className="text-2xl" >FoodieExpress</h2>
            <form action="" className="content-left p-5" onSubmit={ (e) => {
                e.preventDefault();

                localStorage.setItem('auth', 'true');
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);

                window.location.href = '/'
            }} >
             <div className="flex flex-col mb-3" >
                <label >Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl " />
            </div>
            <div className="flex flex-col mb-3" >
                <label >Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl" />
            </div>
            <button type="submit" className="text-white bg-gray-400 w-full rounded-2xl mt-3 p-1" >Login</button>
            < p className="text-center mt-6" >create new account?</p>
            <button type="submit" className="text-white bg-gray-400 w-full rounded-2xl mt-3 p-1">
                 Sign Up
            </button>
            </form>
            
         </div>

         <div className="login-right hidden sm:block md:w-1/2 block flex shadow-lg h-3/4">
             <AnimatePresence mode="wait" >
                    <motion.div className="w-full h-full" >
                        <Image src={imageSRC[index].src} alt="login-image" className="object-cover w-full h-full" width={400} height={400} />
                        <div className="flex justify-center">
                        {imageSRC.map((_, i) => (
                            <motion.div className="w-3 h-3 m-5 rounded-full hidden sm:block" style={{backgroundColor: i === index ? "#000" : "#ccc"}} transition={{type:"spring", stiffness: 300}} ></motion.div>
                        ))}
                    </div>
                    </motion.div>
                </AnimatePresence>
         </div>
      </div>
    )
}