'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lobster_Two } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
});

const baseUrl = "http://localhost:5000";

export default function Navbar() {
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // 🔴 Check authentication status on mount via /users/me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${baseUrl}/users/me`, {
          method: "GET",
          credentials: "include", // 👈 Sends HttpOnly cookie
        });

        if (res.ok) {
          setLogin(true);
        } else {
          setLogin(false);
        }

        console.log("navv", login);
      } catch (error) {
        console.error("Auth check failed:", error);
        setLogin(false);
      }
    };

    checkAuth();
  }, []);

  // 🔴 Log out by clearing cookie via backend
  const handleLogOut = async () => {
    try {
      await fetch(`${baseUrl}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      setLogin(false);
      setMessage('You Logged Out from Your Account');
      setTimeout(() => setMessage(''), 2000);
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav
        className="flex flex-row justify-between w-full top-0 start-0 py-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))',
        }}
      >
        <div className="flex px-2 gap-1 items-center">
          <Image src="/logoblack.jpg" alt="logo" width={50} height={40} />
          <h2 className={`text-orange-300 text-3xl ${lobsterTwo.className}`}>
            FoodieExpress
          </h2>
        </div>

        <div className="hidden space-x-8 md:flex items-center">
          <Link href="/" className="text-white">
            Home
          </Link>
          {!login ? (
            <>
              <Link href="/login" className="text-white">
                Login
              </Link>
              <Link href="/register" className="text-white">
                Register
              </Link>
            </>
          ) : (
            <>
              <button className="text-white cursor-pointer" onClick={handleLogOut}>
                Log-Out
              </button>
              <Link href="/cart" className="text-white">
                Cart
              </Link>
              <Link href="/order" className="text-white">
                Orders
              </Link>
            </>
          )}
        </div>

        <div
          className="md:hidden z-[100] cursor-pointer flex items-center"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon
            icon={open ? faTimes : faBars}
            className="text-3xl text-center pr-4 text-orange-400"
          />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="md:hidden absolute top-21 right-0 flex flex-col w-full bg-black/65 py-5 text-center"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/"
                className="text-white text-2xl hover:text-orange-300 hover:text-3xl border-b border-orange-200 mx-3 pb-2"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              {!login ? (
                <>
                  <Link
                    href="/login"
                    className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2 cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      handleLogOut();
                    }}
                  >
                    Log-Out
                  </button>
                  <Link
                    href="/cart"
                    className="text-white text-2xl hover:text-orange-300 hover:text-3xl py-2"
                    onClick={() => setOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link
                    href="/order"
                    className="text-white text-2xl hover:text-orange-300 hover:text-3xl"
                    onClick={() => setOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {message && (
          <div className="fixed right-4 bg-green-500 text-white p-4 rounded shadow-lg text-sm animate-bounce z-50">
            {message}
          </div>
        )}
      </nav>
    </>
  );
}