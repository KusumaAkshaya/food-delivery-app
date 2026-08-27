'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const baseUrl = "http://localhost:5000";

export default function Register() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);

    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName || !cleanEmail || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (!strongPassword.test(password)) {
            setError(
                "Password must contain at least 8 characters, uppercase, lowercase, number and special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoad(true);

        try {
            const res = await fetch(`${baseUrl}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: cleanName,
                    email: cleanEmail,
                    password,
                    confirmPassword,
                }),
            });

            const responseData = await res.json();

            if (res.ok) {
                alert(responseData.message);
                router.push("/login");
                return;
            }

            setError(responseData.message || "Registration failed.");
        } catch (error) {
            console.error("Registration error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-2">

                {/* Left: food source + conveyor */}
                <div className="w-full max-w-sm lg:w-[320px]">
                    <FoodConveyor />
                </div>

                {/* Register card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative z-20">
                    <div className="text-center mb-7">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            FoodieExpress
                        </h1>

                        <p className="text-md text-orange-300 mt-0.5">
                            Create your account and start ordering
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4">

                        <div className="flex flex-col">
                            <label htmlFor="name" className="mb-1.5 text-md font-medium text-gray-800">
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-3xl border border-gray-400 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                                required
                            />
                        </div>

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
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);

                                        if (error === "Passwords do not match.") {
                                            setError('');
                                        }
                                    }}
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

                            <p className="mt-1.5 text-xs text-gray-500">
                                8+ characters • uppercase • lowercase • number • special character
                            </p>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="mb-1.5 text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter password again"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    className={`w-full rounded-3xl border bg-white px-4 py-3 pr-12 text-gray-800 outline-none transition focus:ring-2 ${
                                        confirmPassword && password !== confirmPassword
                                            ? "border-red-400 focus:ring-red-100"
                                            : "border-gray-400 focus:border-gray-500 focus:ring-gray-200"
                                    }`}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-800 cursor-pointer"
                                >
                                    {showConfirmPassword ? "🙈" : "👁"}
                                </button>
                            </div>

                            {confirmPassword && (
                                password === confirmPassword ? (
                                    <p className="text-xs text-green-600 mt-1">
                                        Passwords match ✓
                                    </p>
                                ) : (
                                    <p className="text-xs text-red-500 mt-1">
                                        Passwords do not match
                                    </p>
                                )
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={load}
                            className="w-full rounded-xl bg-gray-700 px-4 py-3 mt-2 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                            {load ? "Creating Account..." : "Create Account"}
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
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-gray-700 hover:underline underline-offset-4">
                                Login
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

                {/* Right: parcel conveyor */}
                <div className="hidden lg:block w-[320px]">
                    <ParcelConveyor />
                </div>

            </div>
        </div>
    );
}

function FoodConveyor() {
    const foods = [
        <Burger key="burger" />,
        <Pizza key="pizza" />,
        <Fries key="fries" />,
        <Donut key="donut" />,
        <Drink key="drink" />,
    ];

    return (
        <div className="relative w-full h-44 overflow-hidden">

            {/* Food source machine */}
            <div className="absolute left-0 bottom-8 z-10 w-20 h-28 bg-gray-700 rounded-xl shadow-md">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">
                    FOOD
                </div>

                <div className="absolute right-[-6px] bottom-10 w-9 h-14 bg-gray-800 rounded-r-lg" />

                <div className="absolute right-[-9px] bottom-14 w-3 h-6 bg-gray-900 rounded-full" />

                <div className="absolute left-3 right-3 top-10 h-2 bg-gray-500 rounded-full" />

                <div className="absolute left-3 bottom-3 w-3 h-3 rounded-full bg-orange-300" />
                <div className="absolute left-8 bottom-3 w-3 h-3 rounded-full bg-green-300" />
            </div>

            {/* Conveyor belt */}
            <div className="absolute left-16 right-0 bottom-9 h-6 bg-gray-700 rounded-md">
                <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-500" />

                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(90deg, transparent 0px, transparent 24px, white 25px, white 28px)"
                    }}
                    animate={{ x: [0, 28] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="absolute bottom-3 left-20 w-7 h-7 rounded-full bg-gray-500 border-4 border-gray-700" />
            <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-gray-500 border-4 border-gray-700" />

            {/* Moving food items */}
            {foods.map((food, index) => (
                <motion.div
                    key={index}
                    className="absolute bottom-15 left-10"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{
                        x: [0, 55, 285],
                        opacity: [0, 1, 1],
                        y: [4, 0, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 1.4,
                    }}
                >
                    <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {food}
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}

function ParcelConveyor() {
    return (
        <div className="relative w-full h-44 overflow-hidden">

            <div className="absolute left-0 right-0 bottom-9 h-6 bg-gray-700 rounded-md">
                <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-500" />

                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(90deg, transparent 0px, transparent 24px, white 25px, white 28px)"
                    }}
                    animate={{ x: [0, 28] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-gray-500 border-4 border-gray-700" />
            <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-gray-500 border-4 border-gray-700" />

            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className="absolute bottom-15"
                    initial={{ x: -90 }}
                    animate={{ x: 340 }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 2.3,
                    }}
                >
                    <ParcelBox />
                </motion.div>
            ))}
        </div>
    );
}

function ParcelBox() {
    return (
        <motion.div
            className="relative w-20 h-16"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
        >
            <div className="absolute inset-0 bg-amber-700 border-2 border-amber-900 rounded-md shadow-md">

                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-full bg-amber-500" />

                <div className="absolute left-2 right-2 top-5 bg-white rounded-sm text-[8px] text-center py-1 font-semibold text-gray-700">
                    FoodieExpress
                </div>

                <div className="absolute top-1 left-2 w-2 h-2 bg-amber-400 rounded-full opacity-50" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-amber-900 rounded-full opacity-30" />
            </div>
        </motion.div>
    );
}

function Burger() {
    return (
        <div className="relative w-14 h-13 flex flex-col items-center">

            <div className="relative w-13 h-4 bg-amber-300 rounded-t-full border border-amber-500">
                <span className="absolute top-1 left-3 w-1 h-1 bg-white rounded-full" />
                <span className="absolute top-1 right-3 w-1 h-1 bg-white rounded-full" />
                <span className="absolute top-2 left-6 w-1 h-1 bg-white rounded-full" />
            </div>

            <div className="w-14 h-2 bg-green-500 rounded-full -mt-0.5" />
            <div className="w-12 h-2 bg-yellow-300" />
            <div className="w-13 h-2 bg-amber-800 rounded-full" />
            <div className="w-12 h-3 bg-amber-300 rounded-b-xl border border-amber-500" />

        </div>
    );
}

function Pizza() {
    return (
        <div className="relative w-14 h-14">

            <div
                className="absolute inset-0 bg-yellow-300 border-4 border-amber-500"
                style={{ clipPath: "polygon(50% 100%, 2% 0, 98% 0)" }}
            />

            <div className="absolute top-3 left-4 w-2.5 h-2.5 bg-red-500 rounded-full" />
            <div className="absolute top-4 right-3 w-2 h-2 bg-red-500 rounded-full" />
            <div className="absolute top-7 left-6 w-2 h-2 bg-red-500 rounded-full" />

            <div className="absolute top-2 left-7 w-1.5 h-1.5 bg-green-500 rounded-full" />
        </div>
    );
}

function Fries() {
    return (
        <div className="relative w-14 h-15">

            <div className="absolute left-2 top-0 w-2 h-10 bg-yellow-300 rounded-t-sm rotate-[-5deg]" />
            <div className="absolute left-5 top-1 w-2 h-10 bg-yellow-300 rounded-t-sm rotate-2" />
            <div className="absolute left-8 top-0 w-2 h-11 bg-yellow-300 rounded-t-sm rotate-[-2deg]" />
            <div className="absolute left-11 top-2 w-2 h-9 bg-yellow-300 rounded-t-sm rotate-5" />

            <div className="absolute bottom-0 left-1 w-12 h-9 bg-red-500 rounded-b-lg rounded-t-sm shadow-sm">

                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-yellow-300" />

            </div>
        </div>
    );
}

function Donut() {
    return (
        <div className="relative w-13 h-13">

            <div className="absolute inset-0 rounded-full bg-amber-500 shadow-sm" />
            <div className="absolute inset-1 rounded-full bg-pink-400" />
            <div className="absolute inset-[17px] rounded-full bg-gray-100" />

            <div className="absolute top-2 left-4 w-1 h-2 bg-yellow-200 rotate-45 rounded-full" />
            <div className="absolute top-4 right-2 w-1 h-2 bg-white rotate-[-30deg] rounded-full" />
            <div className="absolute bottom-2 left-3 w-1 h-2 bg-blue-300 rotate-20 rounded-full" />

        </div>
    );
}

function Drink() {
    return (
        <div className="relative w-12 h-15">

            <div className="absolute left-7 -top-2 w-1.5 h-8 bg-red-400 rotate-12 rounded-full" />

            <div className="absolute bottom-0 left-1 w-10 h-12 bg-red-500 rounded-b-lg border border-red-700 shadow-sm">

                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-white rounded-full opacity-80" />

            </div>

            <div className="absolute top-1 left-0 w-12 h-2 bg-white border border-gray-300 rounded-full" />

        </div>
    );
}