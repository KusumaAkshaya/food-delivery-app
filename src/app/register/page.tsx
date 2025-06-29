'use client'
import { useState } from "react"
import Image from "next/image"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { motion } from 'framer-motion'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function Register() {
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);

    return (

        <div className="w-full h-screen flex items-center justify-center bg-gray-100" >
            <div className="flex flex-col items-center shadow-xl bg-white pt-10 pb-10 h-3/4">
                <h2 className="text-2xl" >FoodieExpress</h2>
                <form action="" className="content-left p-5" onSubmit={async (e) => {
                    e.preventDefault();

                    if (!strongPassword.test(password)) {
                        setError("Password must be atleast of length 8, include uppercase, lowercase, number, and special character.");
                        return;
                    }

                    setError('');

                    try {
                        const res = await fetch(`${baseUrl}/users/register`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ name, email, password }),
                        });
                        setLoad(true);
                        const responseData = await res.json();

                        if (res.ok) {
                            setLoad(false);
                            alert(responseData.message);
                            router.push('/');
                        }
                        else {
                            setLoad(false);
                            alert(responseData.message);
                        }
                    }
                    catch (error) {
                        setLoad(false);
                        alert('Something went wrong');
                        console.log("error: ", error);
                    }
                }} >
                    <div className="flex flex-col" >
                        <label >Name</label>
                        <input type="name" value={name} onChange={(e) => setName(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl " required />
                    </div>
                    <div className="flex flex-col mb-3" >
                        <label >Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl " required />
                    </div>
                    <div className="flex flex-col mb-3" >
                        <label >Password</label>
                        <input type="password" value={password} onChange={(e) => {
                            setPassword(e.target.value); if (!strongPassword.test(e.target.value)) {
                                setError("Password is too weak");
                            } else {
                                setError("");
                            }
                        }} className="border-1 p-1 min-w-75 rounded-2xl" />
                        {error && (
                            <p className="text-red-500 text-sm max-w-75">{error}</p>
                        )}
                    </div>

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
                    <button type="submit" className="text-white bg-gray-400 w-full rounded-2xl mt-3 p-1" >Create Account</button>

                    <p className="text-center mt-4" >Go back <Link href='/' className="text-gray-500" >Home</Link></p>
                </form>
            </div>
        </div>
    )
}