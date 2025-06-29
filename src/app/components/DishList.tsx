'use client';

import {useRef, useState, useEffect} from "react"
import DishCard from './DishCard';

const categories = [
  { label: 'Biryani', image: '/images/biriyani.jpg' },
  { label: 'South Indian', image: '/images/south.jpg' },
  { label: 'North Indian', image: '/images/north.jpg' },
  { label: 'Cake', image: '/images/cake.jpg' },
  { label: 'Rolls', image: '/images/roll.jpg' },
  { label: 'Burger', image: '/images/burger.jpg' },
  { label: 'Pizza', image: '/images/pizza.jpg' },
  { label: 'Chicken', image: '/images/chicken.jpg' },
  { label: 'Salad', image: '/images/salad.jpg' },
  { label: 'Mutton', image: '/images/mutton.jpg' },
  { label: 'Roti', image: '/images/dishes/tr.jpg' },
  { label: 'Veg Biryani', image: '/images/dishes/vb.jpg' },
];

export default function DishList()
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
        <div className="relative overflow-x-scroll scrollbar-hide" >
        <div ref={filterRef} className="grid grid-rows-2 grid-flow-col gap-8 justify-items-center p-10 overflow-x-auto scrollbar-hide" >
           {categories.map((item, index) => 
        (
            <DishCard  image={item.image} label={item.label} key={index} />
        ))}
         {arrow && (<div className='absolute right-2 top-45/100 bg-orange-500 text-white text-2xl p-2 rounded-full' >
                        ➜
         </div>)}
        </div>
        </div>
    )
}