'use client'
import Image from 'next/image'
import Link from 'next/link'
import {restaurentList} from '../data/restaurentData'
import { useRef, useState, useEffect} from 'react'
import { div } from 'framer-motion/client'

export default function Restaurents()
{   
     const [arrow, setArrow] = useState(true);
     const filterRef = useRef<HTMLDivElement>(null);
    
     useEffect(() => {
        const element = filterRef.current;
        const checkOverflow = () => {
           if(!element) return;
           const isoverflow = element.scrollWidth > element.clientWidth;
           const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 5;
           setArrow(isoverflow && !atEnd) 
        }

        element?.addEventListener("scroll", checkOverflow);
        
        checkOverflow();
     }, [])

     return(
        <div className="pt-10 relative" >
            <div>
               <h2 className="pl-10 text-2xl font-bold " >Restaurents</h2>
            </div>
            <div>
                <div ref={filterRef} className="flex flex-row p-10 overflow-x-scroll scrollbar-hide gap-10" >
                    {restaurentList.map((item, index) => (
                        <Link href={`/restaurant/${item.rname}`} key={index}>
                        
                        <div  className="flex flex-col shadow-lg rounded-sm h-90" >
                            <div className="w-75 h-3/5" >
                                <Image src={item.image} alt={item.name} width={200} height={200} className="object-cover w-full h-full rounded-sm" />
                            </div>
                            <div className="h-2/5 bg-gray-100 content-between p-2" >
                                <h2 className="text-2xl" >{item.name}</h2>
                                <p> {item.type}</p>
                                <p>📍{item.location}</p>
                                <p>⭐{item.rating}</p>
                            </div>
                        </div>
                        </Link>
                    ))}
                    {arrow && (<div className='absolute right-2  top-1/2 bg-gray-500 text-white text-2xl p-3 rounded-full' >
                        ➜
                        </div>)}
                </div>
            </div>
        </div>
     )
}