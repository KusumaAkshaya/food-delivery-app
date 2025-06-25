'use client'
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Register() {
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    return (

        <div className="w-screen h-screen flex justify-items-center bg-gray-100" >
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
                        const res = await fetch("http://localhost:5000/users/register", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ name, email, password }),
                        });

                        const responseData = await res.json();

                        if (res.ok) {
                            alert(responseData.message);
                            router.push('/');
                        }
                        else {
                            alert(responseData.message);
                        }
                    }
                    catch (error) {
                        alert('Something went wrong');
                        console.log("error: ", error);
                    }
                }} >
                    <div className="flex flex-col" >
                        <label >Name</label>
                        <input type="name" value={name} onChange={(e) => setName(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl " />
                    </div>
                    <div className="flex flex-col mb-3" >
                        <label >Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-1 p-1 min-w-75 rounded-2xl " />
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
                    <button type="submit" className="text-white bg-gray-400 w-full rounded-2xl mt-3 p-1" >Create Account</button>
                </form>
            </div>
            <div>
                <Image src={``} alt="" />
            </div>
        </div>
    )
}