'use client';
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";
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
        src: '/images/restaurants/tandoorijunction.jpg',
    }
]

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


export default function LoginPage() {

const [index, setIndex] = useState(0);
const router = useRouter();
    
useEffect( () =>
{
   const timer = setInterval(() => {
      setIndex((prev) => (prev+1)%imageSRC.length);
   }, 3000)
   return () => clearInterval(timer);
}, []);

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [load, setLoad] = useState(false);

    return (
      <div className="flex h-screen items-center justify-center bg-gray-100" >
         <div className="login-left w-full md:w-1/2 flex flex-col items-center shadow-xl bg-white pt-10 pb-10 h-3/4">
            <h2 className="text-2xl" >FoodieExpress</h2>
            <form action="" className="content-left p-5" onSubmit={async (e) => {
                e.preventDefault();
                setLoad(true);
                try
                {
                   const res = await fetch(`${baseUrl}/users/login`, {
                    method: 'POST',
                    headers: {
                       'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password}),
                   });

                   const responseData = await res.json();

                   if(res.ok)
                   {
                       setLoad(false);
                       localStorage.setItem("isLoggedIn", "true");
                       localStorage.setItem("userId", email);
                      alert(responseData.message);
                      router.push('/');
                   }
                   else
                   {
                      setLoad(false);
                      alert(responseData.message);
                   }
                }
                catch(error)
                {
                    setLoad(false);
                    alert('Something went wrong');
                    console.log("error: ",  error);
                }
            }} >
             <div className="flex flex-col mb-3" >
                <label >Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl " required />
            </div>
            <div className="flex flex-col mb-3" >
                <label >Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl" required />
            </div>
            <button type="submit" className="text-white bg-gray-400 w-full rounded-2xl mt-3 p-1" >Login</button>
             {load && <div className="flex justify-center items-center mt-3 ">
            <motion.div
                className="border-t-4 border-gray-400 w-10 h-10 rounded-full "
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
           </div>}
            </form>
            < p className="text-center mt-6" >create new account?</p>
            <button type="submit" className="text-white bg-gray-400 rounded-2xl mt-3 px-6 py-2">
               <Link href="/register" >Sign Up</Link>
            </button>
            <p className="text-center mt-4" >Go back <Link href='/' className="text-gray-500" >Home</Link></p>
            
         </div>

         <div className="login-right hidden sm:block md:w-1/2 block flex shadow-lg h-3/4">
             <AnimatePresence mode="wait" >
                    <motion.div className="w-full h-full" >
                        <Image src={imageSRC[index].src} alt="login-image" className="object-cover w-full h-full" width={400} height={400} />
                        <div className="flex justify-center" >
                        {imageSRC.map((_, i) => (
                            <motion.div className="w-3 h-3 m-5 rounded-full hidden sm:block" style={{backgroundColor: i === index ? "#000" : "#ccc"}} transition={{type:"spring", stiffness: 300}}  key={i}></motion.div>
                        ))}
                    </div>
                    </motion.div>
                </AnimatePresence>
         </div>
      </div>
    )
}