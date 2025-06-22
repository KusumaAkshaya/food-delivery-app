'use client'
import { div } from "framer-motion/client";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from 'next/image'
import SearchBar from "../components/searchBar";

const dummyDishes = [
    { name: 'Biryani', image: '/images/biryani.jpg', price: 180, description: "god, chinese", rating:4.5 },
    { name: 'Cake', image: '/images/cake.jpg', price: 150, description: "god, chinese", rating:4.5 },
    { name: 'Burger', image: '/images/burger.jpg', price: 100, description: "god, chinese", rating:4.5 },
    { name: 'Burger', image: '/images/burger.jpg', price: 140, description: "god, chinese", rating:4.5 },
    { name: 'Burger', image: '/images/burger.jpg', price: 190, description: "god, chinese", rating:4.5 },
    { name: 'Paneer', image: '/images/paneer.jpg', price: 120, description: "god, chinese" , rating:4.5},
];

type Dish = {
    name: string;
    image: string;
    price: number;
    description: string;
    rating:number;
};


export default function SearchData() {

    const searchParam = useSearchParams();
    const query = searchParam.get('query') || '';


    const [filteredData, setFilteredData] = useState<Dish[]>([]);

    useEffect(() => {
        const matches = dummyDishes.filter(
            d => d.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(matches);
    }, [query])

    return (
        <section className="search bg-gray-100 min-h-screen ">
            <div>
               <nav className="flex flex-col sm:flex-row justify-between gap-4 mb-4 bg-white items-center shadow-md " > 
                 <Image src='/logo.jpg' alt="logo" width={150} height={50} />
                 <div className="w-100" > <SearchBar /></div>
               </nav>
        

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-flow-rows gap-6 p-4 justify-items-center" >
                    {
                       
                        filteredData.length > 0 ?
                            (
                                filteredData.map((item, index) => {
                                    return (
                                        <div className="bg-gray-50 p-4 rounded-xl shadow hover:scale-105 transition-transform duration-300 max-w-75 flex flex-col" key={index} >
                                            <div className="w-full">
                                                <Image src={item.image} alt="image" width={400} height={250} className="rounded-md object-cover" />
                                            </div>
                                            <div className="mt-4" >
                                                <div className="flex justify-between mb-1" > <p className="font-semibold text-lg" >{item.name}</p>
                                                    <p>⭐{item.rating}</p> </div>
                                                <div className="flex justify-between " >
                                                     <p className="opacity-60" >{item.description}</p>
                                                     <p>{item.price}</p>
                                                </div>
                                                <button className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors" >Add to CART</button>
                                            </div>
                                
                                        </div>
                                    )
                                })
                            ) :
                            (
                                <p>No results found</p>
                            )
                    }
                </div>
            </div>
        </section>
    )

}