'use client'
import { div } from "framer-motion/client";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from 'next/image'
import SearchBar from "../components/searchBar";
import { addCartItem } from "../utils/cardUtils";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion"
import { dummyDishes } from '../data/data';
import {useRouter} from 'next/navigation';
import { Suspense } from 'react' 


type Dish = {
    name: string;
    image: string;
    price: number;
    description: string;
    rating:number;
    quantity : number;
    restaurant: string;
    restaurantname: string;
};



export default function SearchData() {

    const searchParam = useSearchParams();
    const query = searchParam.get('query') || '';

    const [message, setMessage] = useState('');
    const [filteredData, setFilteredData] = useState<Dish[]>([]);

    useEffect(() => {
        const matches = dummyDishes.filter(
            d => d.name.toLowerCase().includes(query.toLowerCase() )||  d.restaurantname.toLowerCase().includes(query.toLowerCase()),
        );
        setFilteredData(matches);
    }, [query])


    const handleAddtoCART = (item : Dish) => 
    {
        addCartItem(item);
        setMessage('You added item in Cart')
        setTimeout(() => setMessage(''), 2000)
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";

    return (
         <Suspense>
        <section className="search bg-gray-100 min-h-screen ">
            <div>
               <nav className="flex flex-row justify-between gap-4 mb-4 bg-white items-center shadow-md " > 
                 <Image src='/logo.jpg' alt="logo" width={150} height={50} />
                 <div className="w-100" > <SearchBar /></div>
                 <div className="text-3xl rounded-full hover:bg-gray-200 p-2" ><Link href='/cart' >🛒</Link></div>
                 <div className=" rounded-full hover:bg-gray-200 p-2" ><Link href='/' >Home</Link></div>
               </nav>
                {message && (
                    <div className="fixed right-4 bg-green-500 text-white p-4 rounded shadow-lg text-sm animate-bounce z-50">{message}</div>
                )}

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-flow-rows gap-6 p-4 justify-items-center" >
                    {
                        !isLoggedIn ? (<p>Please <Link href='/login' className="text-gray-500" >Login</Link> before search</p>) : 
                        ( filteredData.length > 0 ?
                            (
                    
                             filteredData.map((item, index) => {
                                    return (
                                        <div className="bg-gray-50 p-4 rounded-xl shadow hover:scale-105 transition-transform duration-300 max-w-75 flex flex-col" key={index} >
                                            <div className="w-52 h-50 overflow-hidden">
                                                <Image src={item.image} alt="image" width={400} height={250} className="rounded-md object-fit-cover w-full h-full" />
                                            </div>
                                            <div className="mt-4 h-1/2" >
                                               <div className="text-xl font-semibold text-red-400" >{item.restaurantname}</div>
                                                <div className="flex justify-between mb-1" > <p className="text-lg" >{item.name}</p>
                                                    <p>⭐{item.rating}</p> </div>
                                                <div className="flex justify-between " >
                                                     <p className="opacity-60" >{item.description}</p>
                                                     <p>{item.price}</p>
                                                </div>
                                                <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors" onClick={() => handleAddtoCART(item) } >Add to CART</button>
                                            </div>
                                        </div>
                                    )
                                } )
                            ) :
                            (
                                <p>No results found</p>
                            ) )
                    }
                </div>
            </div>
        </section>
        </Suspense>
    )

}