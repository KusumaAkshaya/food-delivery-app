'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const baseUrl = "http://localhost:5000";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoad(true);

        try {
            const res = await fetch(`${baseUrl}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: cleanEmail,
                    password,
                }),
            });

            const responseData = await res.json();

            if (res.ok) {
                router.push('/');
                return;
            }

            setError(responseData.message || "Invalid login credentials.");
        } catch (error) {
            console.error("Login error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 sm:px-6">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 pt-16 sm:p-8 sm:pt-16">

                <Mascot />

                <div className="text-center mb-7">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        FoodieExpress
                    </h1>

                    <p className="text-md text-orange-300 mt-1">
                        Welcome back, foodie!
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1.5 text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-3xl border border-gray-400 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1.5 text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-3xl border border-gray-400 bg-white px-4 py-3 pr-12 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => alert("Forgot password will be added soon.")}
                            className="self-end mt-2 text-sm text-gray-400 hover:text-gray-600"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={load}
                        className="w-full rounded-xl bg-gray-700 px-4 py-3 mt-1 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {load ? "Logging in..." : "Login"}
                    </button>

                    {load && (
                        <div className="flex justify-center items-center">
                            <motion.div
                                className="border-4 border-gray-200 border-t-gray-500 w-8 h-8 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    )}
                </form>

                <div className="border-t border-gray-100 mt-7 pt-5 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-gray-700 hover:underline underline-offset-4">
                            Register
                        </Link>
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                        Go back{" "}
                        <Link href="/" className="font-medium hover:underline underline-offset-4">
                            Home
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

function Mascot() {
    return (
        <motion.div
            className="absolute -top-27 -left-10 w-36 h-36 z-30 pointer-events-none"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Chef cap */}
            <div className="absolute left-10 top-2 z-20">
                <div className="absolute left-0 top-5 w-8 h-8 bg-white border-2 border-gray-700 rounded-full" />
                <div className="absolute left-6 top-0 w-10 h-10 bg-white border-2 border-gray-700 rounded-full" />
                <div className="absolute left-13 top-5 w-8 h-8 bg-white border-2 border-gray-700 rounded-full" />
                <div className="absolute left-2 top-7 w-16 h-8 bg-white border-x-2 border-b-2 border-gray-700 rounded-b-md" />
            </div>

            {/* Head / circle above card */}
            <motion.div
                className="absolute left-8 top-10 w-22 h-22 bg-orange-400 border-2 border-orange-600 rounded-full shadow-sm z-10"
                animate={{ rotate: [-1, 1, -1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Eyes - more curved */}
                <div className="absolute left-5 top-8 w-4 h-4 border-t-4 border-gray-700 rounded-full" />
                <div className="absolute right-5 top-8 w-4 h-4 border-t-4 border-gray-700 rounded-full" />

                {/* Smile - more curved */}
                <div className="absolute left-1/2 top-7 -translate-x-1/2 w-11 h-11 border-b-4 border-gray-700 rounded-full" />

                {/* Cheeks */}
                <div className="absolute left-3 top-13 w-3 h-2 bg-orange-300 rounded-full opacity-70" />
                <div className="absolute right-3 top-13 w-3 h-2 bg-orange-300 rounded-full opacity-70" />
            </motion.div>

            {/* Left arm from middle of face holding spoon */}
            <motion.div
                className="absolute left-1 top-20 z-0 origin-right"
                animate={{ rotate: [-10, -18, -10] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-12 h-2.5 bg-orange-400 rounded-full" />
                <div className="absolute -left-1 -top-1 w-4 h-4 bg-white border border-gray-400 rounded-full" />
                <div className="absolute -left-3 -top-8 w-1.5 h-10 bg-gray-500 rounded-full rotate-[-12deg]" />
                <div className="absolute -left-5 -top-12 w-5 h-8 bg-gray-300 border border-gray-500 rounded-full rotate-[-12deg]" />
            </motion.div>

            {/* Right arm from middle of face waving */}
            <motion.div
                className="absolute right-0 top-20 z-0 origin-left"
                animate={{ rotate: [10, -42, -20, -42, 10, 10] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
            >
                <div className="w-12 h-2.5 bg-orange-400 rounded-full" />

                <motion.div
                    className="absolute right-[-6px] top-[-5px] w-5 h-5 bg-white border border-gray-400 rounded-full"
                    animate={{ rotate: [0, 15, -15, 15, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2.4 }}
                >
                    <div className="absolute right-[-2px] top-0 w-2 h-3 bg-white border border-gray-400 rounded-full rotate-20" />
                    <div className="absolute right-0 -top-2 w-2 h-3 bg-white border border-gray-400 rounded-full" />
                    <div className="absolute right-2 -top-2 w-2 h-3 bg-white border border-gray-400 rounded-full -rotate-15" />
                </motion.div>
            </motion.div>

            {/* Legs only inside the box area */}
            <motion.div
                className="absolute left-[62px] top-[110px] origin-top z-0"
                animate={{ rotate: [14, -14, 14] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-1.5 h-11 bg-gray-700 rounded-full" />
                <div className="absolute -left-2 bottom-[-4px] w-6 h-3 bg-gray-800 rounded-full rotate-6" />
            </motion.div>

            <motion.div
                className="absolute left-[86px] top-[110px] origin-top z-0"
                animate={{ rotate: [-14, 14, -14] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-1.5 h-11 bg-gray-700 rounded-full" />
                <div className="absolute -left-2 bottom-[-4px] w-6 h-3 bg-gray-800 rounded-full -rotate-6" />
            </motion.div>
        </motion.div>
    );
}