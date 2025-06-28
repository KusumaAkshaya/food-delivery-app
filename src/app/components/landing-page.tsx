'use client'

import Navbar from "./Navbar";
import SearchBar from "./searchBar";
import { Lobster_Two } from 'next/font/google'
import {motion} from 'framer-motion'

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
})


export default function LandingPage() {
  return (
    <div className="h-[calc(100vh - 10px)] flex flex-col login-div" >
      <Navbar />
      <div className="h-[calc(100vh-65px)] w-full flex flex-col items-center justify-center overflow-hidden" style={{backgroundColor : 'rgba(0, 0, 0, 0.4)'}} >
        <motion.h1 className={`text-orange-300 sm:text-6xl md:text-7xl lg:text-8xl text-5xl lobster-two-regular-italic ${lobsterTwo.className} `} initial={{ opacity: 0.5, y: -15 }}
                        animate={{ opacity: 1, y: 0 }} transition={{duration: 1, ease: 'easeOut'}} >FoodieExpress</motion.h1>
        <motion.p className="description text-white text-center sm:text-xl md:text-3xl text-xl mt-1" animate={{opacity: 1 , y: -10}} initial={{opacity: 0, y: 0}} transition={{delay: 0.3, duration: 0.7}} >Get your favorite dishes delivered to your door!</motion.p>
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.2}} className="flex items-center" ><SearchBar /> </motion.div>
      </div> 
    </div>
  );
}