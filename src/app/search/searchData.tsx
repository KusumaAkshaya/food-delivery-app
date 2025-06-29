'use client'
import { div, span } from "framer-motion/client";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from 'next/image'
import SearchBar from "../components/searchBar";
import { addCartItem } from "../utils/cardUtils";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion"
import { dummyDishes } from '../data/data';


type Dish = {
    name: string;
    image: string;
    price: number;
    description: string;
    rating: number;
    quantity: number;
    restaurant: string;
    restaurantname: string;
    veg: boolean;
    offer: string;
    category: string;
};

const categories = ["Biryani", "Pizza", "Chinese", "South Indian", "Desserts", "Drinks"];

export default function SearchData() {

    const searchParam = useSearchParams();
    const query = searchParam.get('query') || '';

    const [message, setMessage] = useState('');
    const [filteredData, setFilteredData] = useState<Dish[]>([]);
    const [applyFilter, setApplyFilter] = useState({veg: false, buy1get1: false, below250: false, category: ''});

    useEffect(() => {
        let matches = dummyDishes.filter(
            d => d.name.toLowerCase().includes(query.toLowerCase()) || d.restaurantname.toLowerCase().includes(query.toLowerCase()) || d.category.toLowerCase().includes(query.toLowerCase()),
        );

        if(applyFilter.veg)
        {
            matches = matches.filter(d => d.veg);
        }

        if(applyFilter.below250) 
        {
            matches = matches.filter(d => d.price <= 250);
        }

        if(applyFilter.buy1get1)
        {
            matches = matches.filter(d => d.offer === 'buy1get1')
        }

        if(applyFilter.category)
        {
            matches = matches.filter(d => d.category?.toLowerCase() === applyFilter.category.toLowerCase());
        }

        setFilteredData(matches);
    }, [query, applyFilter])


    const handleAddtoCART = (item: Dish) => {
        addCartItem(item);
        setMessage('You added item in Cart')
        setTimeout(() => setMessage(''), 2000)
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";

    return (
        <section className="search bg-gray-100 min-h-screen ">
            <div>
                <nav className="flex flex-row justify-between gap-4 mb-4 bg-white items-center shadow-md " >
                    <Image src='/logo.jpg' alt="logo" width={150} height={50} className="hidden sm:block" />
                    <div className="w-100" > <SearchBar /></div>
                    <div className="flex" >
                    <div className="text-3xl rounded-full hover:bg-gray-200 p-2" ><Link href='/cart' >🛒</Link></div>
                    <div className=" rounded-full hover:bg-gray-200 p-2 text-3xl" ><Link href='/' >🏠︎</Link></div>
                    </div>
                </nav>
                {message && (
                    <div className="fixed right-4 bg-green-500 text-white p-4 rounded shadow-lg text-sm animate-bounce z-50">{message}</div>
                )}


                <div className="" >
                    {
                        !isLoggedIn ? (<p>Please <Link href='/login' className="text-gray-500" >Login</Link> before search</p>) :
                            (  <div className="flex w-full lg:flex-row flex-col justify-center" > 

                                <div className=" left-15 lg:block min-w-75 text-center text-2xl" >
                                            <aside className="overflow-auto bg-orange-100 lg:h-screen" >
                                                <h2 className="text-gray-600 border-b border-orange-500 py-4 text-3xl caveat mx-3 justify-center" >Filters</h2>
                                                <ul className="flex lg:flex-col flex-row gap-2 overflow-x-auto scrollbar-hide" >
                                                    <li className='min-w-30 py-2 hover:scale-103 hover:underline hover:decoration-orange-500 underline-offset-4' onClick={() => setApplyFilter(prev => ({... prev, veg: !prev.veg}))}>Veg only</li>
                                                    <li className='min-w-50 py-2 hover:scale-103 hover:underline hover:decoration-orange-500 underline-offset-4' onClick={() => setApplyFilter(prev => ({...prev, buy1get1: !prev.buy1get1}))} >Buy 1 Get 1 free</li>
                                                    <li className='min-w-50 py-2 hover:scale-103 hover:underline hover:decoration-orange-500 underline-offset-4' onClick={() => setApplyFilter(prev => ({...prev, below250: !prev.below250}))}>Price below 250</li>
                                                    <li className='min-w-30 py-2 hover:scale-103 hover:underline hover:decoration-orange-500 underline-offset-4' onClick={() => setApplyFilter(prev => ({...prev, category: 'Desserts'}))}>Desserts</li>
                                                    <li className='min-w-30 py-2 hover:scale-103 hover:underline hover:decoration-orange-500 underline-offset-4' onClick={() => setApplyFilter(prev => ({...prev, category: 'Beverages'}))}>Beverages</li>
                                                </ul>
                                                 <button className='bg-red-500 text-white rounded hover:scale-110 px-3 py-1' onClick={() => setApplyFilter({veg: false, buy1get1: false, below250: false, category: ''})} >
                                                    Clear Filters
                                                 </button>
                                                
                                            </aside>
                                        </div>
                                
                               { filteredData.length > 0 ?
                                (
                                    <div>
                                        <h2 className="text-center text-gray-800 lobster-two-regular-italic capitalize pt-2" >Results for <span className="text-orange-500" >{query}</span> from top restaurants </h2>
                                         <div className="flex flow-row w-full justify-center" >
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-flow-rows gap-6 p-4 justify-items-center" >
                                            {filteredData.map((item, index) => {
                                                return (
                                                    <div className="bg-white px-4 pt-2 rounded-xl shadow hover:scale-105 duration-300 max-w-85 flex flex-col" key={index} >
                                                        <div className="relative w-52 h-50 overflow-hidden">
                                                            {item.offer && <div className="absolute top-0 left-0 bg-green-500 text-white text-sm px-1" >Buy1Get1</div>}
                                                            <Image src={item.image} alt="image" width={400} height={250} className="rounded-md object-fit-cover w-full h-full" />
                                                        </div>
                                                        <div className="mt-4 h-1/2" >
                                                            <div className="text-2xl font-bold text-orange-500 libre-baskerville-regular-italic" >{item.restaurantname}</div>
                                                            <div className="flex justify-between mb-1" > <p className="text-lg" >{item.name}</p>
                                                                <div className="bg-orange-500 rounded-md p-1 text-white font-bold" ><p>⭐{item.rating}</p></div> </div>
                                                            <div className="flex justify-between " >
                                                                <p className="opacity-60" >{item.description}</p>
                                                                <p>₹{item.price}</p>
                                                            </div>
                                                            <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors mt-3" onClick={() => handleAddtoCART(item)} >Add to CART</button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div> </div>
                                ) :
                                (   
                                    <div className="lg:w-5/10" >
                                    <p className='text-center text-2xl pt-5'> No Matching dishes found</p>
                                    </div>
                                )}
                                
                                </div>)
                    }
                </div>
            </div>
        </section>
    )

}